package com.example.demo.asset.model;

import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Connector extends Asset {
    private boolean preconfigured = false;

	public boolean isPreconfigured() {
		return preconfigured;
	}

	public void setPreconfigured(boolean preconfigured) {
		this.preconfigured = preconfigured;
	}
    
}
