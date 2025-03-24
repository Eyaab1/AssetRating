package com.example.demo.asset.model;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("Template")
public class Template extends Asset {
    @Column(unique = true)
    private String name;
}
