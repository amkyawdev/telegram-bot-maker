const { createApp, ref, onMounted } = Vue;

const app = createApp({
    setup() {
        const currentPage = ref('loader');
        
        const navigate = (page) => {
            currentPage.value = page;
            window.scrollTo(0, 0);
        };
        
        onMounted(() => {
            setTimeout(() => {
                currentPage.value = 'main';
            }, 2000);
        });
        
        return {
            currentPage,
            navigate
        };
    }
});

app.component('loader', Loader);
app.component('main-page', MainPage);
app.component('api-config', ApiConfig);
app.component('system-prompt', SystemPrompt);
app.component('bot-list', BotList);
app.component('about', About);

app.mount('#app');
