package com.graafik.controller;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.graafik.model.Entities.Role;
import com.graafik.services.RoleService;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

	private final RoleService roleService;

	public RoleController(RoleService roleService) {
		this.roleService = roleService;
	}

	@GetMapping
	public ResponseEntity<List<Role>> getAllRoles() {
		return ResponseEntity.ok(roleService.getAllRoles());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Role> getRoleById(@PathVariable UUID id) {
		Optional<Role> r = roleService.getRoleById(id);
		return r.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<Role> createRole(@RequestBody Role role) {
		Role saved = roleService.saveRole(role);
		return ResponseEntity.created(URI.create("/api/roles/" + saved.getId())).body(saved);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Role> updateRole(@PathVariable UUID id, @RequestBody Role role) {
		Optional<Role> updated = roleService.updateRole(id, role);
		return updated.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteRole(@PathVariable UUID id) {
		boolean deleted = roleService.deleteRole(id);
		if (deleted) return ResponseEntity.noContent().build();
		return ResponseEntity.notFound().build();
	}
}
