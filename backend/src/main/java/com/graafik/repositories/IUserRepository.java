package com.graafik.repositories;

import com.graafik.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IUserRepository extends JpaRepository<User, Long> {
    // You can define custom queries here if needed, e.g.
    // Optional<User> findByUsername(String username);
}
