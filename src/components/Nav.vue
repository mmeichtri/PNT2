<script setup>
</script>


<template>

<div class="navClass">
    <nav class="navTest">
        <RouterLink class="navLink" to="/home">Home</RouterLink>
        <!-- <RouterLink class="navLink" to="/routines">Routine</RouterLink> -->
        <RouterLink class="navLink" to="/login">Login</RouterLink>
    </nav>
</div>

</template>

<style scoped>
.navClass {
    width: 100%;
    background-color: #1d1d1d;
    padding: 10px 5px;
    margin-bottom: 3em;
    border-radius: 0 0 5px 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.592);
    text-align: center;
}

.navTest{
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.navLink {
    margin: 10px;
    text-decoration: none;
    color: #c9c9c9;
    font-weight: bold;
}
</style>
