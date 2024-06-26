import express from "express";
import cors from "cors";

// SDK de mercado pago
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: "APP_USR-224410819417262-062602-5ba65a4676a26a31b1bab03f4ad9fc1e-269574474",
});

const app = express();
const port  = 3003;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Soy el server !");
});

app.post("/create_preference", async (req, res) => {
    try {
        const body = {
           items: req.body.items.map((item)=>({
            title: item.nameProduct,
            quantity: item.quantity,
            unit_price: item.price,
            picture_url:item.img,
           })
           ),

            back_urls: {
                success: "https://www.mercadopago.com.ar/home",
                failure: "https://www.mercadopago.com.ar/home",
                pending: "https://www.mercadopago.com.ar/home",
            },
            auto_return:"approved",
        };
        console.log(req.body, "hola");

        const preference= new Preference(client);
        const result = await preference.create({ body });
        res.json({
            id: result.id,
        });
    } catch (error){
        console.log(error);
        res.status(500).json({
            error: "Error al crear la preferencia",
        });
    }
});

app.listen(port, () => {
    console.log("El servidor esta corriendo en el puerto 3003");
});