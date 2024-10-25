// src/pages/full_ordered.js
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore"; // onSnapshot을 import합니다.
import { db } from "../firebase";
import BasicModal from "./modal";

export default function FullOrdered() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Firestore에서 ordered 컬렉션을 실시간으로 구독합니다.
    const unsubscribe = onSnapshot(collection(db, "ordered"), (querySnapshot) => {
      const orderData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(orderData);
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, []);

  // 테이블 별로 주문을 그룹화하는 함수
  const groupOrdersByTable = () => {
    return orders.reduce((acc, order) => {
      const { tableId, orders: orderItems } = order; // order 객체에서 tableId와 orders를 추출
      if (!acc[tableId]) {
        acc[tableId] = {
          items: {},
          totalPrice: 0, // 총 가격 초기화
        };
      }
      orderItems.forEach(item => {
        const itemKey = item.name; // 아이템 이름으로 그룹화
        if (!acc[tableId].items[itemKey]) {
          acc[tableId].items[itemKey] = { ...item, quantity: 0 }; // 수량 초기화
        }
        acc[tableId].items[itemKey].quantity += item.quantity; // 수량 합산
        acc[tableId].totalPrice += item.price * item.quantity; // 총 가격 계산
      });
      return acc;
    }, {});
  };

  const groupedOrders = groupOrdersByTable();

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4">전체 테이블 별 주문 현황</h2>
      <BasicModal />
      {Object.keys(groupedOrders).length > 0 ? (
        Object.keys(groupedOrders).map((tableId) => (
          <div key={tableId} className="border border-gray-300 p-4 mb-4 rounded-md">
            <h3 className="text-lg font-semibold">테이블 {tableId}</h3>
            <ul>
              {Object.entries(groupedOrders[tableId].items).map(([itemName, itemDetails], index) => (
                <li key={index} className="mb-1">
                  {itemName} (수량: {itemDetails.quantity}, 가격: {itemDetails.price} 장)
                </li>
              ))}
            </ul>
            <p className="font-semibold">총 가격: {groupedOrders[tableId].totalPrice} 장</p>
          </div>
        ))
      ) : (
        <p>주문이 없습니다.</p>
      )}
    </div>
  );
}
