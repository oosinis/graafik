package com.graafik.repositories;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.graafik.model.Entities.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {
}
