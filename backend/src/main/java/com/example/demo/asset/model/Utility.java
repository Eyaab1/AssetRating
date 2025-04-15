package com.example.demo.asset.model;

import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Utility extends Asset {
    private String dependencies;
	
	public String getDependencies() {
		return dependencies;
	}
	public void setDependencies(String dependencies) {
		this.dependencies = dependencies;
	}
}
