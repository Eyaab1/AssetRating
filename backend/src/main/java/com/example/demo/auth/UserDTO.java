package com.example.demo.auth;

import java.util.Date;

public class UserDTO {

	 private Long id;
	    private String firstName;
	    private String lastName;
	    private String email;
	    private Role role;
	    private Date createdAt;
	    private Boolean enabled;

	    public Date getCreatedAt() {
	        return createdAt;
	    }

	    public void setCreatedAt(Date createdAt) {
	        this.createdAt = createdAt;
	    }

	    public UserDTO(User user) {
	        this.id = user.getId();
	        this.firstName = user.getFirstName();
	        this.lastName = user.getLastName();
	        this.email = user.getEmail();
	        this.role = user.getRole();
	        this.createdAt=user.getCreatedAt();
	        this.setEnabled(user.isEnabled());
	        }

	 
	    public Long getId() {
	    	return id; 
	    	}
	    public String getFirstName() {
	    	return firstName; 
	    	}
	    public String getLastName() {
	    	return lastName; 
	    	}
	    public String getEmail() {
	    	return email; 
	    	}
	    public Role getRole() {
	    	return role; 
	    	}

		public Boolean getEnabled() {
			return enabled;
		}

		public void setEnabled(Boolean enabled) {
			this.enabled = enabled;
		}
}
