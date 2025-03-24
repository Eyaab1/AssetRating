package com.example.demo.asset.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("Sheet")
public class Sheet extends Asset {
    private String icon;
}
