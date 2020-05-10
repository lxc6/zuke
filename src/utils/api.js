// 封装的axios 基地址
import axios from 'axios'
import{baseURL} from "./baseURL"
let API = axios.create({
    baseURL
});
export {API}