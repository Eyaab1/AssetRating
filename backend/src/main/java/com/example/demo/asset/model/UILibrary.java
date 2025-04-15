package com.example.demo.asset.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("UILibrary")
public class UILibrary extends Asset {

	
}
