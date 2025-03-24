package com.example.demo.asset.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("Widget")
public class Widget extends Asset {
    private String icon;
}
