package com.example.demo.notification;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import com.example.demo.auth.User;

@Entity
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    private boolean read = false;

    private Date createdAt = new Date();

    @ManyToOne
    private User recipient;

    public Notification() {
		super();}
    
	public Notification(String content, boolean read, Date createdAt, User recipient) {

		this.content = content;
		this.read = read;
		this.createdAt = createdAt;
		this.recipient = recipient;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public boolean isRead() {
		return read;
	}

	public void setRead(boolean read) {
		this.read = read;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public User getRecipient() {
		return recipient;
	}

	public void setRecipient(User recipient) {
		this.recipient = recipient;
	}
    
    
}
