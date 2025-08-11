package com.pickle.backend.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
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

    @Value("${vnpay.tmn-code}")
    private String vnp_TmnCode;

    @Value("${vnpay.hash-secret}")
    private String vnp_HashSecret;

    @Value("${vnpay.pay-url}")
    private String vnp_PayUrl;

    @Value("${vnpay.return-url}")
    private String vnp_ReturnUrl;

    @GetMapping("/create_payment")
    public ResponseEntity<Map<String, String>> createPayment(HttpServletRequest req,
                                                             @RequestParam String orderId,
                                                             @RequestParam long amount) throws UnsupportedEncodingException {

        String clientIp = req.getRemoteAddr();
        log.info("=== CREATE PAYMENT ===");
        log.info("OrderId='{}' amount='{}' clientIp='{}'", orderId, amount, clientIp);

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

        log.info("HashData  : {}", hashData);
        log.info("SecureHash: {}", secureHash);

        String paymentUrl = vnp_PayUrl + "?" + query + "&vnp_SecureHashType=HmacSHA512&vnp_SecureHash=" + secureHash;
        log.info("Payment URL: {}", paymentUrl);

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
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = fields.remove("vnp_SecureHash");
        fields.remove("vnp_SecureHashType");

        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        for (int i = 0; i < fieldNames.size(); i++) {
            String fieldName = fieldNames.get(i);
            String fieldValue = fields.get(fieldName);
            hashData.append(fieldName).append('=')
                    .append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8));
            if (i < fieldNames.size() - 1) {
                hashData.append('&');
            }
        }

        String mySecureHash = hmacSHA512(vnp_HashSecret, hashData.toString());

        log.info("=== PAYMENT RETURN DEBUG ===");
        log.info("HashData from VNPAY: {}", hashData);
        log.info("SecureHash from VNPAY: {}", vnp_SecureHash);
        log.info("SecureHash from system: {}", mySecureHash);

        // Nếu hash hợp lệ -> redirect sang FE
        if (mySecureHash.equalsIgnoreCase(vnp_SecureHash)) {
            String redirectUrl = "http://localhost:5173/PaymentReturnPage?" + request.getQueryString();
            response.sendRedirect(redirectUrl);
        } else {
            // Redirect tới trang thất bại
            response.sendRedirect("http://localhost:5173/PaymentReturnPage?status=fail");
        }
    }



}
