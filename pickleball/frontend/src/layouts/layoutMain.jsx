// components/LayoutMain.jsx
import Header from "../components/Header"; // Sửa lỗi chính tả từ "Hearder" thành "Header"
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom"; // Thêm import Outlet từ react-router-dom

const LayoutMain = () => {
    return (
        <div>
            <Header /> {/* Header xuất hiện trên tất cả các trang */}
            <main>
                <Outlet /> {/* Nội dung của từng trang sẽ được hiển thị ở đây */}
            </main>
            <Footer /> {/* Footer xuất hiện trên tất cả các trang */}
        </div>
    );
};

export default LayoutMain;