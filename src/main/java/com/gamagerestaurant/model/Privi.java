package com.gamagerestaurant.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Privi {
   private Boolean sel;
    private Boolean ins;
    private Boolean upd;
    private Boolean del;
}
