package com.example.demo.auth;

public class UserDTO {

	 private Long id;
	    private String firstName;
	    private String lastName;
	    private String email;
	    private Role role;

	    public UserDTO(User user) {
	        this.id = user.getId();
	        this.firstName = user.getFirstName();
	        this.lastName = user.getLastName();
	        this.email = user.getEmail();
	        this.role = user.getRole();
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
}
