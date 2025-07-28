package com.backend.graafik.repository;

import com.backend.graafik.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // You can define custom queries here if needed, e.g.
    // Optional<User> findByUsername(String username);
}
