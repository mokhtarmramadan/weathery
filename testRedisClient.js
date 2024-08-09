import { factory } from './utils/redis';

(async () => {
    const redisClient = await factory();
    console.log(redisClient.isAlive());
    console.log(await redisClient.get('name'));
    await redisClient.set('name', 'ali', 5);
    console.log(await redisClient.get('name'));

    setTimeout(async () => {
        console.log(await redisClient.get('name'));
    }, 1000*10)

    await redisClient.set('name', 'ali');
    await redisClient.del('name');
    console.log(await redisClient.get('name'));

})();
