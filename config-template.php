<?php
/**
 * Configuration simple - Morgan Digital
 * Configuration de base pour une landing page avec liens directs Stripe
 */

return [
    // === FORMSPREE CONFIGURATION ===
    'formspree' => [
        'endpoint' => 'https://formspree.io/f/mblkeoqb', // Ton endpoint Formspree
    ],
    
    // === EMAIL CONFIGURATION ===
    'email' => [
        'admin_email' => 'heldt.morgan@proton.me',
    ],
    
    // === SÉCURITÉ BASIQUE ===
    'security' => [
        'rate_limit_per_minute' => 5,
        'allowed_origins' => [
            'https://www.morgandigital.fr',
            'https://morgandigital.fr'
        ]
    ]
];
?>