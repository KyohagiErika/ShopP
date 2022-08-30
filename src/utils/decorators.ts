export function ControllerService() {
    return function(target: any, propKey: PropertyKey, propDescriptor: PropertyDescriptor) {
        function addWatch(func: Function) {
            return async function(...args: any[]) {
                const req = args[0];
                const res = args[1];

                console.log(`[${new Date().toLocaleString()}][${req.method} ${req.baseUrl}${req.url}]`);
                console.log(`Queries: ${req.query}`);
                console.log(`Params: ${req.params}`);
                console.log(`Body: ${req.body}`);
                try {
                    await func(...args);
                    console.log('Executed successfully!');
                } catch (err) {
                    console.log('Executed with error:');
                    console.error(err);
                    res.status(500).send({ message: 'Server error!' });
                }
            }
        }
        propDescriptor.value = addWatch(target[propKey]);
    }
}