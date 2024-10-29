import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Sparkles, AlertCircle, Clock, XCircle } from "lucide-react";

const VnDong = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const PaymentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const details = {};
    searchParams.forEach((value, key) => {
      details[key] = value;
    });
    setPaymentDetails(details);
  }, [searchParams]);

  if (!paymentDetails) {
    return <div>Đang tải...</div>;
  }

  const isSuccess =
    paymentDetails.code === "00" &&
    paymentDetails.cancel === "false" &&
    paymentDetails.status === "PAID";
  const isPending =
    paymentDetails.code === "00" &&
    paymentDetails.cancel === "false" &&
    (paymentDetails.status === "PENDING" || paymentDetails.status === "PROGRESS");
  const isCancelled =
    paymentDetails.code === "00" &&
    paymentDetails.cancel === "true" &&
    paymentDetails.status === "CANCELLED";

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "text-green-400";
      case "PENDING":
      case "PROGRESS":
        return "text-yellow-400";
      case "CANCELLED":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = () => {
    if (isSuccess) return <Sparkles className="mb-2 h-8 w-8 text-yellow-300" />;
    if (isPending) return <Clock className="mb-2 h-8 w-8 text-white" />;
    if (isCancelled) return <XCircle className="mb-2 h-8 w-8 text-red-300" />;
    return <AlertCircle className="mb-2 h-8 w-8 text-gray-300" />;
  };

  const getStatusMessage = () => {
    if (isSuccess) return "Thanh toán thành công";
    if (isPending) return "Thanh toán đang xử lý";
    if (isCancelled) return "Thanh toán đã hủy";
    return "Trạng thái thanh toán không xác định";
  };

  const getStatusNote = () => {
    if (isSuccess) return "Giao dịch đã được thanh toán thành công!";
    if (isPending) return "Giao dịch đang được xử lý. Vui lòng chờ.";
    if (isCancelled)
      return "Giao dịch đã bị hủy hoặc đang chờ thanh toán.";
    return "Không thể xác định trạng thái giao dịch.";
  };

  const getHeaderColor = () => {
    if (isSuccess) return "bg-emerald-500";
    if (isPending) return "bg-yellow-500";
    if (isCancelled) return "bg-red-500";
    return "bg-gray-500";
  };

  return (
    <div className="flex items-center justify-center p-4 py-20">
      <div className="w-full max-w-md bg-gray-900 text-gray-100 rounded-lg shadow-lg">
        <div className={`${getHeaderColor()} flex flex-col items-center justify-center rounded-t-lg p-6`}>
          {getStatusIcon()}
          <h2 className="text-2xl font-bold">{getStatusMessage()}</h2>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex justify-between">
            <span className="text-gray-400">Mã giao dịch</span>
            <span className="font-medium">{paymentDetails.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Mã đơn hàng</span>
            <span className="font-medium">
              {parseInt(paymentDetails.orderCode).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Số tiền</span>
            <span className="font-medium">
              {VnDong.format(Number(paymentDetails.amount))}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Trạng thái</span>
            <span className={`font-medium ${getStatusColor(paymentDetails.status)}`}>
              {paymentDetails.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Ghi chú</span>
            <span className="text-right font-medium">{getStatusNote()}</span>
          </div>
        </div>
        <div className="p-4">
          <button
            className="w-full bg-sky-500 text-white py-2 px-4 rounded-lg hover:bg-sky-600"
            onClick={() => navigate("/profile")}
          >
            Quay lại trang cá nhân
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
