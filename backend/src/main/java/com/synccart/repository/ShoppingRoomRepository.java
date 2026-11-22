package com.synccart.repository;

import com.synccart.model.ShoppingRoom;
import com.synccart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShoppingRoomRepository extends JpaRepository<ShoppingRoom, Long> {
    Optional<ShoppingRoom> findByRoomCode(String roomCode);
    Boolean existsByRoomCode(String roomCode);
    List<ShoppingRoom> findByHost(User host);
}
