package com.example.demo.asset.model;


import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;

import com.example.demo.auth.User;
import com.example.rating.model.Rating;
import com.example.review.model.Review;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asset {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;
    @ManyToOne
    @JoinColumn(name = "publisher_id", nullable = false)
    private User publisher;
    private String publisherMail;
    private Date publishDate;
    
    
    private String status;

    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL)
    private List<Review> comments;

    @OneToMany(mappedBy = "asset", cascade = CascadeType.ALL)
    private List<Rating> ratings;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public User getPublisher() {
		return publisher;
	}

	public void setPublisher(User currentUser) {
		this.publisher = currentUser;
	}

	public String getPublisherMail() {
		return publisherMail;
	}

	public void setPublisherMail(String publisherMail) {
		this.publisherMail = publisherMail;
	}

	public Date getPublishDate() {
		return publishDate;
	}

	public void setPublishDate(Date publishDate) {
		this.publishDate = publishDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public List<Review> getComments() {
		return comments;
	}

	public void setComments(List<Review> comments) {
		this.comments = comments;
	}

	public List<Rating> getRatings() {
		return ratings;
	}

	public void setRatings(List<Rating> ratings) {
		this.ratings = ratings;
	}

}