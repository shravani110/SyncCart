package com.synccart.repository;

import com.synccart.model.CartItem;
import com.synccart.model.Product;
import com.synccart.model.ShoppingRoom;
import com.synccart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByRoomOrderByUpdatedAtDesc(ShoppingRoom room);
    Optional<CartItem> findByRoomAndProduct(ShoppingRoom room, Product product);
    Optional<CartItem> findByRoomAndProductAndAddedBy(ShoppingRoom room, Product product, User addedBy);
    void deleteByRoom(ShoppingRoom room);
    List<CartItem> findByRoomAndAddedBy(ShoppingRoom room, User addedBy);
}
