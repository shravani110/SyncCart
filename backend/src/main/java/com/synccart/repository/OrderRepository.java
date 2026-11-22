package com.synccart.repository;

import com.synccart.model.Order;
import com.synccart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByHostOrderByCreatedAtDesc(User host);
    List<Order> findByRoomCodeOrderByCreatedAtDesc(String roomCode);
}
