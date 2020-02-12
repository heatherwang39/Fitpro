export const testRoute = (app) => {
    app.get("/test", async (_, res) => {
        const test = "test";
        res.status(200).send({ test });
    });
};

export default testRoute;
