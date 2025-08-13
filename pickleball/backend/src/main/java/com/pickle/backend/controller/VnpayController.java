package com.pickle.backend.controller;

import com.pickle.backend.dto.DebtDTO;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.text.SimpleDateFormat;


@Slf4j
@RestController
@RequestMapping("/api/vnpay")
public class VnpayController {

    @Autowired
    DebtController debtController;

    @Value("${vnpay.tmn-code}")
    private String vnp_TmnCode;

    @Value("${vnpay.hash-secret}")
    private String vnp_HashSecret;

    @Value("${vnpay.pay-url}")
    private String vnp_PayUrl;

    @Value("${vnpay.return-url}")
    private String vnp_ReturnUrl;

    @Value("${frontend.url}")
    private String frontendUrl;


    @GetMapping("/create_payment")
    public ResponseEntity<Map<String, String>> createPayment(HttpServletRequest req,
                                                             @RequestParam String orderId,
                                                             @RequestParam long amount) throws UnsupportedEncodingException {

        String clientIp = req.getRemoteAddr();

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", "2.1.0");
        vnp_Params.put("vnp_Command", "pay");
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount * 100)); // nhân 100
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", orderId);
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang " + orderId);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", clientIp);
        vnp_Params.put("vnp_CreateDate", new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()));

        // Sort keys
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (int i = 0; i < fieldNames.size(); i++) {
            String fieldName = fieldNames.get(i);
            String fieldValue = vnp_Params.get(fieldName);
            if (fieldValue != null && !fieldValue.isEmpty()) {
                hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8))
                     .append('=')
                     .append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
                if (i < fieldNames.size() - 1) {
                    hashData.append('&');
                    query.append('&');
                }
            }
        }

        String secureHash = hmacSHA512(vnp_HashSecret, hashData.toString());

        String paymentUrl = vnp_PayUrl + "?" + query + "&vnp_SecureHashType=HmacSHA512&vnp_SecureHash=" + secureHash;

        Map<String, String> res = new HashMap<>();
        res.put("paymentUrl", paymentUrl);
        return ResponseEntity.ok(res);
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac.init(secretKeySpec);
            byte[] bytes = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hash = new StringBuilder();
            for (byte b : bytes) {
                hash.append(String.format("%02x", b));
            }
            return hash.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error while hashing", e);
        }
    }
    @GetMapping("/payment_return")
    public void paymentReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // 1) Lấy toàn bộ params từ VNPay
        Map<String, String> params = new HashMap<>();
        for (Enumeration<String> e = request.getParameterNames(); e.hasMoreElements();) {
            String k = e.nextElement();
            String v = request.getParameter(k);
            if (v != null && !v.isEmpty()) params.put(k, v);
        }

        // 2) Xác thực chữ ký
        String vnp_SecureHash = params.get("vnp_SecureHash");
        String vnp_ResponseCode = params.get("vnp_ResponseCode");
        String orderId = params.get("vnp_TxnRef");
        String amount = params.get("vnp_Amount");
        String txnNo = params.get("vnp_TransactionNo");
        String bankCode = params.get("vnp_BankCode");

        // 3) Verify signature (giữ nguyên phần xác thực chữ ký)
        Map<String, String> verify = new HashMap<>(params);
        verify.remove("vnp_SecureHash");
        verify.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(verify.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        for (int i = 0; i < fieldNames.size(); i++) {
            String name = fieldNames.get(i);
            String value = verify.get(name);
            if (value != null && !value.isEmpty()) {
                hashData.append(name).append('=')
                       .append(URLEncoder.encode(value, StandardCharsets.UTF_8));
                if (i < fieldNames.size() - 1) hashData.append('&');
            }
        }

        String mySecureHash = hmacSHA512(vnp_HashSecret, hashData.toString());
        boolean validSignature = mySecureHash.equalsIgnoreCase(vnp_SecureHash);
        boolean paid = "00".equals(vnp_ResponseCode);

        // 4) Redirect về FE với URL dạng path
        if (validSignature && paid) {
            // Chuyển đổi amount từ VNPay (đã nhân 100) về giá trị thực
            String actualAmount = amount != null ? String.valueOf(Long.parseLong(amount) / 100) : "0";

            String redirectUrl = String.format(
                "%s/PaymentReturnPage/success/%s/%s/%s/%s/%s",
                frontendUrl,
                encodePathSegment(orderId),
                encodePathSegment(actualAmount),
                encodePathSegment(txnNo),
                encodePathSegment(bankCode),
                encodePathSegment(vnp_ResponseCode)
            );
            // update debt
            DebtDTO debt = new DebtDTO();
            debt.setStatus(DebtDTO.DebtStatus.PAID);
            debt.setMethod(DebtDTO.Method.CREDIT_CARD);
            debtController.updateDebt(Long.parseLong(orderId),debt);
            response.sendRedirect(redirectUrl);
        } else {
            String redirectUrl = String.format(
                "%s/PaymentReturnPage/fail/%s/%s/%s",
                frontendUrl,
                encodePathSegment(orderId),
                encodePathSegment(vnp_ResponseCode),
                encodePathSegment(validSignature ? "payment_failed" : "invalid_signature")
            );
            response.sendRedirect(redirectUrl);
        }
    }

    private String encodePathSegment(String value) {
        return value != null ? URLEncoder.encode(value, StandardCharsets.UTF_8) : "";
    }

    private String nvl(String value) {
        return value != null ? value : "";
    }

}
