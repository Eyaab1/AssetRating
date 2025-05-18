package com.example.demo.dto;


import com.example.demo.auth.User;
import com.example.demo.auth.UserDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserActivityDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private int activityScore;

    public UserActivityDTO(UserDTO user, int activityScore) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.role = user.getRole().name();
        this.activityScore = activityScore;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public int getActivityScore() {
		return activityScore;
	}

	public void setActivityScore(int activityScore) {
		this.activityScore = activityScore;
	}
    
}