package com.example.demo.auth;

import java.util.ArrayList;
import java.util.List;

import com.example.demo.asset.model.Asset;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role; // USER or CONTRIBUTOR
    @OneToMany(mappedBy = "publisher", cascade = CascadeType.ALL)
    private List<Asset> publishedAssets = new ArrayList<>();

	public List<Asset> getPublishedAssets() {
		return publishedAssets;
	}

	public void setPublishedAssets(List<Asset> publishedAssets) {
		this.publishedAssets = publishedAssets;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	public Role getRole() {
	    return role;
	}

	public void setRole(Role role) {
	    this.role = role;
	}

}