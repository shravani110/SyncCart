package com.synccart.repository;

import com.synccart.model.Order;
import com.synccart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByOrderNumber(String orderNumber);
    List<Order> findByHostOrderByCreatedAtDesc(User host);
    List<Order> findByRoomCodeOrderByCreatedAtDesc(String roomCode);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN o.items i WHERE o.host = :user OR i.addedByUser = :user OR LOWER(o.host.username) = LOWER(:username) OR LOWER(i.addedByUser.username) = LOWER(:username) OR o.roomCode IN :roomCodes ORDER BY o.createdAt DESC")
    List<Order> findOrdersForUserWithRooms(@Param("user") User user, @Param("username") String username, @Param("roomCodes") List<String> roomCodes);

    @Query("SELECT DISTINCT o FROM Order o LEFT JOIN o.items i WHERE o.host = :user OR i.addedByUser = :user OR LOWER(o.host.username) = LOWER(:username) OR LOWER(i.addedByUser.username) = LOWER(:username) ORDER BY o.createdAt DESC")
    List<Order> findOrdersForUser(@Param("user") User user, @Param("username") String username);
}
