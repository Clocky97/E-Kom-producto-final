import { body } from "express-validator";

export const createProductValidations = [
    body("product_name").trim()
    .isString()
    .isEmpty()
    ,
    body("price").isDecimal()
    ,
    body("brand").trim()
    .isString()
    .isEmpty()
    ,
    body("image").isURL()
]; 