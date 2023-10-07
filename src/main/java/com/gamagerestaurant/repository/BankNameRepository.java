package com.gamagerestaurant.repository;

import com.gamagerestaurant.model.BankBranch;
import com.gamagerestaurant.model.BankName;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankNameRepository extends JpaRepository<BankName,Integer> {
}
