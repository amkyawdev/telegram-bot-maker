const { createApp, ref, computed, onMounted } = Vue;

const app = createApp({
    setup() {
        const currentPage = ref('loader');
        const serverKey = ref('openrouter');

        const navigate = (page, server = null) => {
            currentPage.value = page;
            if (server) {
                serverKey.value = server;
            }
        };

        const goBack = () => {
            switch (currentPage.value) {
                case 'api':
                    currentPage.value = 'main';
                    break;
                case 'prompt':
                    currentPage.value = 'api';
                    break;
                case 'bots':
                    currentPage.value = 'main';
                    break;
                case 'about':
                    currentPage.value = 'main';
                    break;
                default:
                    currentPage.value = 'main';
            }
        };

        const onLoaderComplete = () => {
            currentPage.value = 'main';
        };

        return {
            currentPage,
            serverKey,
            navigate,
            goBack,
            onLoaderComplete
        };
    },
    template: `
        <div id="app">
            <Loader v-if="currentPage === 'loader'" @complete="onLoaderComplete"></Loader>
            <MainPage v-else-if="currentPage === 'main'" @navigate="navigate"></MainPage>
            <ApiConfig v-else-if="currentPage === 'api'" :serverKey="serverKey" @navigate="navigate"></ApiConfig>
            <SystemPrompt v-else-if="currentPage === 'prompt'" @navigate="navigate"></SystemPrompt>
            <BotList v-else-if="currentPage === 'bots'" @navigate="navigate"></BotList>
            <About v-else-if="currentPage === 'about'" @navigate="navigate"></About>
        </div>
    `
});

// Register components
app.component('Loader', Loader);
app.component('MainPage', MainPage);
app.component('ApiConfig', ApiConfig);
app.component('SystemPrompt', SystemPrompt);
app.component('BotList', BotList);
app.component('About', About);

// Add ref and computed to window for component use
window.ref = ref;
window.computed = computed;
window.onMounted = onMounted;

app.mount('#app');
