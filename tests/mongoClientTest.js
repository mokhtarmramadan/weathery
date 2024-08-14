import { mongodbConnector } from './utils/db.js';

const dbClient = null;

const waitConnection = () => {
    return new Promise((resolve, reject) => {
        let i = 0;
	const dbClient = mongodbConnector();
        const repeatFct = async () => {
            await setTimeout(() => {
                i += 1;
                if (i >= 10) {
                    reject()
                }
                else if(!dbClient.isAlive()) {
                    repeatFct()
                }
                else {
                    resolve()
                }
            }, 1000);
        };
        repeatFct();
    })
};

(async () => {
    const dbClient = await mongodbConnector();
    console.log(dbClient.isAlive());
    console.log(await dbClient.nbUsers());
    console.log(await dbClient.nbPlans());
})();
