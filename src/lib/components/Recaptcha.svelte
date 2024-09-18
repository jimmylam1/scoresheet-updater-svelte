<script>
    import { page } from '$app/stores';
    import { onMount } from 'svelte';

    onMount(() => {
        const sitekey = $page.data.recaptcha;
        window.onloadCallback = () => {
            window.grecaptcha.render('g-recaptcha', { sitekey });
        };

        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.defer = true;
        s.src = `https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit`;
    
        document.head.appendChild(s);
    
        return () => {
            s.remove();
        };
    });
</script>
  
<div id="g-recaptcha"></div>

<style>
    #g-recaptcha {
        margin: 15px auto;
    }
</style>
