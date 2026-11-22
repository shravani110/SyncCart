package com.synccart.repository;

import com.synccart.model.RoomMember;
import com.synccart.model.ShoppingRoom;
import com.synccart.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomMemberRepository extends JpaRepository<RoomMember, Long> {
    List<RoomMember> findByRoom(ShoppingRoom room);
    Optional<RoomMember> findByRoomAndUser(ShoppingRoom room, User user);
    Boolean existsByRoomAndUser(ShoppingRoom room, User user);
    List<RoomMember> findByUserOrderByJoinedAtDesc(User user);
    void deleteByRoomAndUser(ShoppingRoom room, User user);
}
