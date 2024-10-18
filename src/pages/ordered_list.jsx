// src/pages/ordered_list.js
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import dayjs from "dayjs"; // 날짜 포맷팅을 위한 라이브러리
import BasicModal from "./modal";

export default function OrderedList() {
  const [orders, setOrders] = useState([]);
  const [highlightedOrderIds, setHighlightedOrderIds] = useState(new Set()); // 클릭된 주문 ID를 관리할 상태

  useEffect(() => {
    // Firestore에서 ordered 컬렉션을 timestamp로 정렬하여 쿼리합니다.
    const q = query(collection(db, "ordered"), orderBy("timestamp", "asc"));

    // 실시간 데이터 업데이트를 위해 onSnapshot 사용
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const orderData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(orderData);
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  const handleConfirm = (orderId) => {
    setHighlightedOrderIds((prev) => {
      const newHighlightedOrderIds = new Set(prev);
      newHighlightedOrderIds.add(orderId); // 주문 ID를 추가
      return newHighlightedOrderIds;
    });
  };

  const handleUnConfirm = (orderId) => {
    setHighlightedOrderIds((prev) => {
      const newHighlightedOrderIds = new Set(prev);
      newHighlightedOrderIds.delete(orderId); // 주문 ID를 제거하여 다시 회색으로 변경
      return newHighlightedOrderIds;
    });
  };

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4">테이블 별 주문 목록  </h2>
      {orders.length > 0 ? (
        <ul className="w-full">
          {orders.map((order) => (
            <li
              key={order.id}
              className={`border ${highlightedOrderIds.has(order.id) ? 'border-red-500' : 'border-gray-300'} p-4 mb-4 rounded-md`} // 조건부 클래스 적용
            >
              <div className="flex justify-between">
                <strong>테이블 번호 {order.tableId}</strong>
                <span className="text-sm text-gray-500">
                  주문 시간: {dayjs(order.timestamp.toDate()).format("YYYY-MM-DD HH:mm")}
                </span>
              </div>
              <p className="font-semibold mb-2">총 가격: {order.totalPrice} ₩</p>
              <ul className="ml-4">
                {order.orders.map((item, index) => (
                  <li key={index} className="mb-1">
                    {item.name} (수량: {item.quantity}, 가격: {item.price} ₩)
                  </li>
                ))}
              </ul>
              <ul className="flex gap-2">
                <button
                  className="bg-blue-500 text-white px-2 rounded-md"
                  onClick={() => handleConfirm(order.id)} // 버튼 클릭 시 handleConfirm 호출
                >
                  확인
                </button>
                <button
                  className="bg-red-500 text-white px-2 rounded-md" // 취소 버튼 색상 변경
                  onClick={() => handleUnConfirm(order.id)} // 버튼 클릭 시 handleUnConfirm 호출
                >
                  취소
                </button>
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>주문이 없습니다.</p>
      )}
    </div>
  );
}
