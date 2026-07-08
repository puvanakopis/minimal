export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Color {
    id: string;
    name: string;
    hex: string;
}

export interface Product {
    id: number;
    name: string;
    slug?: string;
    description?: string;
    price: number;
    category?: string;
    gender: 'men' | 'women' | 'unisex';
    mainImage?: string;
    image: string;
    images?: string[];
    colors?: Color[];
    sizes?: (Size | string)[];
    details?: string[];
    features?: string[];
    material?: string;
    careInstructions?: string[];
    rating?: number;
    reviewCount?: number;
}



export const allProducts: Product[] = [
    {
        id: 1,
        slug: 'structured-wool-overcoat',
        name: 'Structured Wool Overcoat',
        description: 'A timeless investment piece crafted from premium Italian wool blend. Featuring a sharp tailored silhouette, structured shoulders, and a clean three-button closure.',
        price: 450.0,
        category: 'Outerwear',
        gender: 'unisex',
        mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE',
        ],
        colors: [
            { id: 'camel', name: 'Camel Taupe', hex: '#C19A6B' },
            { id: 'black', name: 'Midnight Black', hex: '#1A1A1A' },
            { id: 'grey', name: 'Slate Grey', hex: '#708090' }
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        details: [
            '70% Wool, 30% Polyamide',
            'Fully lined with 100% Viscose',
            'Two internal welt pockets',
            'Dry clean only',
            'Made in Italy'
        ],
        rating: 4.8,
        reviewCount: 124
    },
    {
        id: 2,
        slug: 'pima-cotton-capsule-tee',
        name: 'Pima Cotton Capsule Tee',
        description: 'Essential everyday t-shirt crafted from premium Pima cotton. Features a classic fit, ribbed crewneck, and exceptional softness that lasts wash after wash.',
        price: 65.0,
        category: 'Tops',
        gender: 'unisex',
        mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFfEXdLOobvy4SRYxnJBWoUp7RT-yAPzzxFmBeBmW2kpipxFmX9EzshjdkL4o5iy7KVxSnQXQc47Hz0Dlk8p_H9h63qIimN97JwTi7UCj0mmBa7oJRmeLSIuxwTH43imRMcDv2DJ4IzrJHva6cafhZtWY5aS_Ir3jATghtSXkW7SjcZhZWXJDk-ubt9j_qTU9182qXaIK5cM8dKRsb5_meNqMvc1VsIAaJ4PE_r456ITS4-LOCl__PnQDxoOPRxmbFOVM9t9Fr789b',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFfEXdLOobvy4SRYxnJBWoUp7RT-yAPzzxFmBeBmW2kpipxFmX9EzshjdkL4o5iy7KVxSnQXQc47Hz0Dlk8p_H9h63qIimN97JwTi7UCj0mmBa7oJRmeLSIuxwTH43imRMcDv2DJ4IzrJHva6cafhZtWY5aS_Ir3jATghtSXkW7SjcZhZWXJDk-ubt9j_qTU9182qXaIK5cM8dKRsb5_meNqMvc1VsIAaJ4PE_r456ITS4-LOCl__PnQDxoOPRxmbFOVM9t9Fr789b',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCFfEXdLOobvy4SRYxnJBWoUp7RT-yAPzzxFmBeBmW2kpipxFmX9EzshjdkL4o5iy7KVxSnQXQc47Hz0Dlk8p_H9h63qIimN97JwTi7UCj0mmBa7oJRmeLSIuxwTH43imRMcDv2DJ4IzrJHva6cafhZtWY5aS_Ir3jATghtSXkW7SjcZhZWXJDk-ubt9j_qTU9182qXaIK5cM8dKRsb5_meNqMvc1VsIAaJ4PE_r456ITS4-LOCl__PnQDxoOPRxmbFOVM9t9Fr789b',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCFfEXdLOobvy4SRYxnJBWoUp7RT-yAPzzxFmBeBmW2kpipxFmX9EzshjdkL4o5iy7KVxSnQXQc47Hz0Dlk8p_H9h63qIimN97JwTi7UCj0mmBa7oJRmeLSIuxwTH43imRMcDv2DJ4IzrJHva6cafhZtWY5aS_Ir3jATghtSXkW7SjcZhZWXJDk-ubt9j_qTU9182qXaIK5cM8dKRsb5_meNqMvc1VsIAaJ4PE_r456ITS4-LOCl__PnQDxoOPRxmbFOVM9t9Fr789b',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCFfEXdLOobvy4SRYxnJBWoUp7RT-yAPzzxFmBeBmW2kpipxFmX9EzshjdkL4o5iy7KVxSnQXQc47Hz0Dlk8p_H9h63qIimN97JwTi7UCj0mmBa7oJRmeLSIuxwTH43imRMcDv2DJ4IzrJHva6cafhZtWY5aS_Ir3jATghtSXkW7SjcZhZWXJDk-ubt9j_qTU9182qXaIK5cM8dKRsb5_meNqMvc1VsIAaJ4PE_r456ITS4-LOCl__PnQDxoOPRxmbFOVM9t9Fr789b',
        ],
        colors: [
            { id: 'white', name: 'Pristine White', hex: '#FFFFFF' },
            { id: 'black', name: 'Black', hex: '#000000' },
            { id: 'heather-grey', name: 'Heather Grey', hex: '#B0B0B0' },
            { id: 'navy', name: 'Navy', hex: '#1B2A4A' }
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        details: [
            '100% Pima Cotton',
            'Pre-shrunk fabric',
            'Ribbed crewneck collar',
            'Machine wash cold',
            'Responsibly made in Peru'
        ],
        rating: 4.9,
        reviewCount: 342
    },
    {
        id: 3,
        slug: 'raw-selvedge-denim',
        name: 'Raw Selvedge Denim',
        description: 'Premium Japanese selvedge denim jeans featuring raw, unwashed fabric that will develop a unique patina over time. Classic straight fit with reinforced construction.',
        price: 185.0,
        category: 'Bottoms',
        gender: 'men',
        mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEJdtkthRNwQ0GOEkyVsi9MtMOxr7jk5OcgitCK-fbOEVovDDtu3TXJb2rhV4OUsg0wjfnz7GHc2SyxmIm_TcmFo3FdYoYfMfS0rOW_AFHLERCuR5O-FU6oYRiWFwpckIVrrXN2LdqdJwiuj2royCRAvB4Sqdrs4u7QqpMQH-s74hXPdkWJ_3c5AhwEYV6N2d52qAhw1Nr68hXfKNGeadMQmamYDJsQkNomAobOBh3EkM77ShWMoZvACotu6IjTx485iSycVKQ4-Xh',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEJdtkthRNwQ0GOEkyVsi9MtMOxr7jk5OcgitCK-fbOEVovDDtu3TXJb2rhV4OUsg0wjfnz7GHc2SyxmIm_TcmFo3FdYoYfMfS0rOW_AFHLERCuR5O-FU6oYRiWFwpckIVrrXN2LdqdJwiuj2royCRAvB4Sqdrs4u7QqpMQH-s74hXPdkWJ_3c5AhwEYV6N2d52qAhw1Nr68hXfKNGeadMQmamYDJsQkNomAobOBh3EkM77ShWMoZvACotu6IjTx485iSycVKQ4-Xh',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBEJdtkthRNwQ0GOEkyVsi9MtMOxr7jk5OcgitCK-fbOEVovDDtu3TXJb2rhV4OUsg0wjfnz7GHc2SyxmIm_TcmFo3FdYoYfMfS0rOW_AFHLERCuR5O-FU6oYRiWFwpckIVrrXN2LdqdJwiuj2royCRAvB4Sqdrs4u7QqpMQH-s74hXPdkWJ_3c5AhwEYV6N2d52qAhw1Nr68hXfKNGeadMQmamYDJsQkNomAobOBh3EkM77ShWMoZvACotu6IjTx485iSycVKQ4-Xh',
        ],
        colors: [
            { id: 'indigo', name: 'Indigo Wash', hex: '#1E3A5F' },
            { id: 'black', name: 'Black Raw', hex: '#1A1A1A' }
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        details: [
            '100% Japanese Selvedge Denim',
            '14.5 oz raw denim',
            'Unwashed - expect 2-3% shrinkage',
            'Made in Japan',
            'Button fly closure'
        ],
        rating: 4.7,
        reviewCount: 89
    },
    {
        id: 4,
        slug: 'silk-blend-lounge-set',
        name: 'Silk Blend Lounge Set',
        description: 'Luxurious lounge set crafted from a premium silk-cotton blend. Features a relaxed-fit button-up shirt and matching drawstring pants for ultimate comfort.',
        price: 210.0,
        category: 'Loungewear',
        gender: 'women',
        mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2jjINy6X9ZmAL4TH-7YZv-jAgM_DqAMy5Qi-pLg2WQMKDfgkZCbrbIbaGZ_Bga_TcYvpHAr3lifqniq4w2QOfFeiyPuCMosLCCBZ_HjaaT7pwxS9s48nF2zz22_ic3IEbtbGojgJR9lDAhajnBAVWDQT3In_cQC2EBfnbNUQ3fM4cVQycrlvZ6tlbjNuHMTp2f3EY1p59GroL9sxakiADc1SSJL5EeB6DzfTPT9_qO81t3iClmClubUMQzTXltq53rc8Z6N6ySN-G',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2jjINy6X9ZmAL4TH-7YZv-jAgM_DqAMy5Qi-pLg2WQMKDfgkZCbrbIbaGZ_Bga_TcYvpHAr3lifqniq4w2QOfFeiyPuCMosLCCBZ_HjaaT7pwxS9s48nF2zz22_ic3IEbtbGojgJR9lDAhajnBAVWDQT3In_cQC2EBfnbNUQ3fM4cVQycrlvZ6tlbjNuHMTp2f3EY1p59GroL9sxakiADc1SSJL5EeB6DzfTPT9_qO81t3iClmClubUMQzTXltq53rc8Z6N6ySN-G',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuB2jjINy6X9ZmAL4TH-7YZv-jAgM_DqAMy5Qi-pLg2WQMKDfgkZCbrbIbaGZ_Bga_TcYvpHAr3lifqniq4w2QOfFeiyPuCMosLCCBZ_HjaaT7pwxS9s48nF2zz22_ic3IEbtbGojgJR9lDAhajnBAVWDQT3In_cQC2EBfnbNUQ3fM4cVQycrlvZ6tlbjNuHMTp2f3EY1p59GroL9sxakiADc1SSJL5EeB6DzfTPT9_qO81t3iClmClubUMQzTXltq53rc8Z6N6ySN-G',
        ],
        colors: [
            { id: 'mist-grey', name: 'Mist Grey', hex: '#C8C9C7' },
            { id: 'cream', name: 'Champagne Cream', hex: '#F7E8D0' },
            { id: 'sage', name: 'Sage Green', hex: '#9CAF88' }
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        details: [
            '60% Silk, 40% Cotton',
            'Breathable and temperature-regulating',
            'Elastic waistband with drawstring',
            'Dry clean recommended',
            'Made in Italy'
        ],
        rating: 4.9,
        reviewCount: 67
    },
    {
        id: 5,
        slug: 'signature-cashmere-knit',
        name: 'Signature Cashmere Knit',
        description: 'Luxuriously soft 100% cashmere sweater with a classic crewneck silhouette. Lightweight yet warm, perfect for layering or wearing on its own.',
        price: 295.0,
        category: 'Knitwear',
        gender: 'unisex',
        mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE',
        ],
        colors: [
            { id: 'midnight-navy', name: 'Midnight Navy', hex: '#1A2A3A' },
            { id: 'heather-grey', name: 'Heather Grey', hex: '#B8B8B8' },
            { id: 'cream', name: 'Cream', hex: '#F5F0E1' },
            { id: 'burgundy', name: 'Burgundy', hex: '#6B2D3B' }
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        details: [
            '100% Grade-A Mongolian Cashmere',
            '2-ply yarn for durability',
            'Ribbed cuffs and hem',
            'Dry clean only',
            'Ethically sourced and produced'
        ],
        rating: 5.0,
        reviewCount: 203
    },
    {
        id: 6,
        slug: 'tailored-pleated-trousers',
        name: 'Tailored Pleated Trousers',
        description: 'Sophisticated high-waisted trousers with subtle front pleats. Cut from a premium wool-blend fabric for a structured yet comfortable fit.',
        price: 175.0,
        category: 'Bottoms',
        gender: 'men',
        mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFfEXdLOobvy4SRYxnJBWoUp7RT-yAPzzxFmBeBmW2kpipxFmX9EzshjdkL4o5iy7KVxSnQXQc47Hz0Dlk8p_H9h63qIimN97JwTi7UCj0mmBa7oJRmeLSIuxwTH43imRMcDv2DJ4IzrJHva6cafhZtWY5aS_Ir3jATghtSXkW7SjcZhZWXJDk-ubt9j_qTU9182qXaIK5cM8dKRsb5_meNqMvc1VsIAaJ4PE_r456ITS4-LOCl__PnQDxoOPRxmbFOVM9t9Fr789b',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFfEXdLOobvy4SRYxnJBWoUp7RT-yAPzzxFmBeBmW2kpipxFmX9EzshjdkL4o5iy7KVxSnQXQc47Hz0Dlk8p_H9h63qIimN97JwTi7UCj0mmBa7oJRmeLSIuxwTH43imRMcDv2DJ4IzrJHva6cafhZtWY5aS_Ir3jATghtSXkW7SjcZhZWXJDk-ubt9j_qTU9182qXaIK5cM8dKRsb5_meNqMvc1VsIAaJ4PE_r456ITS4-LOCl__PnQDxoOPRxmbFOVM9t9Fr789b',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCFfEXdLOobvy4SRYxnJBWoUp7RT-yAPzzxFmBeBmW2kpipxFmX9EzshjdkL4o5iy7KVxSnQXQc47Hz0Dlk8p_H9h63qIimN97JwTi7UCj0mmBa7oJRmeLSIuxwTH43imRMcDv2DJ4IzrJHva6cafhZtWY5aS_Ir3jATghtSXkW7SjcZhZWXJDk-ubt9j_qTU9182qXaIK5cM8dKRsb5_meNqMvc1VsIAaJ4PE_r456ITS4-LOCl__PnQDxoOPRxmbFOVM9t9Fr789b',
        ],
        colors: [
            { id: 'deep-charcoal', name: 'Deep Charcoal', hex: '#2C2E2F' },
            { id: 'navy', name: 'Navy', hex: '#1B2A4A' },
            { id: 'taupe', name: 'Taupe', hex: '#8B7D6B' }
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        details: [
            '54% Wool, 44% Polyester, 2% Elastane',
            'Front pleats for added shape',
            'Side adjusters at waist',
            'Unfinished hem for tailoring',
            'Dry clean only'
        ],
        rating: 4.6,
        reviewCount: 54
    },
    {
        id: 7,
        slug: 'merino-rib-turtleneck',
        name: 'Merino Rib Turtleneck',
        description: 'Elegant fine-gauge merino wool turtleneck with a flattering ribbed texture. Slim fit design that works perfectly under blazers or on its own.',
        price: 140.0,
        category: 'Knitwear',
        gender: 'women',
        mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE',
        ],
        colors: [
            { id: 'stone-beige', name: 'Stone Beige', hex: '#D4C5B0' },
            { id: 'black', name: 'Black', hex: '#1A1A1A' },
            { id: 'burgundy', name: 'Burgundy', hex: '#722F37' },
            { id: 'forest-green', name: 'Forest Green', hex: '#2B4F3B' }
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        details: [
            '100% Extra-fine Merino Wool',
            '16-gauge knit for smooth finish',
            'Fold-over turtleneck collar',
            'Ribbed cuffs and hem',
            'Machine wash delicate'
        ],
        rating: 4.8,
        reviewCount: 112
    },
    {
        id: 8,
        slug: 'relaxed-linen-shirt',
        name: 'Relaxed Linen Shirt',
        description: 'Breathable European linen shirt with a relaxed, boxy fit. Perfect for warm weather with its natural moisture-wicking properties.',
        price: 110.0,
        category: 'Tops',
        gender: 'men',
        mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFfEXdLOobvy4SRYxnJBWoUp7RT-yAPzzxFmBeBmW2kpipxFmX9EzshjdkL4o5iy7KVxSnQXQc47Hz0Dlk8p_H9h63qIimN97JwTi7UCj0mmBa7oJRmeLSIuxwTH43imRMcDv2DJ4IzrJHva6cafhZtWY5aS_Ir3jATghtSXkW7SjcZhZWXJDk-ubt9j_qTU9182qXaIK5cM8dKRsb5_meNqMvc1VsIAaJ4PE_r456ITS4-LOCl__PnQDxoOPRxmbFOVM9t9Fr789b',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFfEXdLOobvy4SRYxnJBWoUp7RT-yAPzzxFmBeBmW2kpipxFmX9EzshjdkL4o5iy7KVxSnQXQc47Hz0Dlk8p_H9h63qIimN97JwTi7UCj0mmBa7oJRmeLSIuxwTH43imRMcDv2DJ4IzrJHva6cafhZtWY5aS_Ir3jATghtSXkW7SjcZhZWXJDk-ubt9j_qTU9182qXaIK5cM8dKRsb5_meNqMvc1VsIAaJ4PE_r456ITS4-LOCl__PnQDxoOPRxmbFOVM9t9Fr789b',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCFfEXdLOobvy4SRYxnJBWoUp7RT-yAPzzxFmBeBmW2kpipxFmX9EzshjdkL4o5iy7KVxSnQXQc47Hz0Dlk8p_H9h63qIimN97JwTi7UCj0mmBa7oJRmeLSIuxwTH43imRMcDv2DJ4IzrJHva6cafhZtWY5aS_Ir3jATghtSXkW7SjcZhZWXJDk-ubt9j_qTU9182qXaIK5cM8dKRsb5_meNqMvc1VsIAaJ4PE_r456ITS4-LOCl__PnQDxoOPRxmbFOVM9t9Fr789b',
        ],
        colors: [
            { id: 'soft-sand', name: 'Soft Sand', hex: '#E8DCC6' },
            { id: 'white', name: 'White', hex: '#FFFFFF' },
            { id: 'sky-blue', name: 'Sky Blue', hex: '#87CEEB' },
            { id: 'olive', name: 'Olive', hex: '#556B2F' }
        ],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        details: [
            '100% European Linen',
            'Relaxed boxy fit',
            'Button-down collar',
            'Mother of pearl buttons',
            'Machine wash cold'
        ],
        rating: 4.7,
        reviewCount: 88
    },
    {
        id: 9,
        slug: 'cropped-utility-jacket',
        name: 'Cropped Utility Jacket',
        description: 'Modern take on the classic utility jacket with a cropped silhouette. Features multiple pockets and adjustable waist tabs for a customized fit.',
        price: 260.0,
        category: 'Outerwear',
        gender: 'women',
        mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEJdtkthRNwQ0GOEkyVsi9MtMOxr7jk5OcgitCK-fbOEVovDDtu3TXJb2rhV4OUsg0wjfnz7GHc2SyxmIm_TcmFo3FdYoYfMfS0rOW_AFHLERCuR5O-FU6oYRiWFwpckIVrrXN2LdqdJwiuj2royCRAvB4Sqdrs4u7QqpMQH-s74hXPdkWJ_3c5AhwEYV6N2d52qAhw1Nr68hXfKNGeadMQmamYDJsQkNomAobOBh3EkM77ShWMoZvACotu6IjTx485iSycVKQ4-Xh',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEJdtkthRNwQ0GOEkyVsi9MtMOxr7jk5OcgitCK-fbOEVovDDtu3TXJb2rhV4OUsg0wjfnz7GHc2SyxmIm_TcmFo3FdYoYfMfS0rOW_AFHLERCuR5O-FU6oYRiWFwpckIVrrXN2LdqdJwiuj2royCRAvB4Sqdrs4u7QqpMQH-s74hXPdkWJ_3c5AhwEYV6N2d52qAhw1Nr68hXfKNGeadMQmamYDJsQkNomAobOBh3EkM77ShWMoZvACotu6IjTx485iSycVKQ4-Xh',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBEJdtkthRNwQ0GOEkyVsi9MtMOxr7jk5OcgitCK-fbOEVovDDtu3TXJb2rhV4OUsg0wjfnz7GHc2SyxmIm_TcmFo3FdYoYfMfS0rOW_AFHLERCuR5O-FU6oYRiWFwpckIVrrXN2LdqdJwiuj2royCRAvB4Sqdrs4u7QqpMQH-s74hXPdkWJ_3c5AhwEYV6N2d52qAhw1Nr68hXfKNGeadMQmamYDJsQkNomAobOBh3EkM77ShWMoZvACotu6IjTx485iSycVKQ4-Xh',
        ],
        colors: [
            { id: 'olive-khaki', name: 'Olive Khaki', hex: '#6B6B4A' },
            { id: 'black', name: 'Black', hex: '#1A1A1A' },
            { id: 'camel', name: 'Camel', hex: '#C19A6B' }
        ],
        sizes: ['XS', 'S', 'M', 'L'],
        details: [
            '70% Cotton, 30% Nylon',
            'Water-resistant finish',
            'Adjustable waist tabs',
            'Six exterior pockets',
            'Machine wash gentle'
        ],
        rating: 4.8,
        reviewCount: 46
    },
    {
        id: 10,
        slug: 'organic-cotton-poplin-dress',
        name: 'Organic Cotton Poplin Dress',
        description: 'Effortless midi dress made from crisp organic cotton poplin. Features a smocked bodice, puff sleeves, and tiered skirt for a romantic silhouette.',
        price: 225.0,
        category: 'Dresses',
        gender: 'women',
        mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2jjINy6X9ZmAL4TH-7YZv-jAgM_DqAMy5Qi-pLg2WQMKDfgkZCbrbIbaGZ_Bga_TcYvpHAr3lifqniq4w2QOfFeiyPuCMosLCCBZ_HjaaT7pwxS9s48nF2zz22_ic3IEbtbGojgJR9lDAhajnBAVWDQT3In_cQC2EBfnbNUQ3fM4cVQycrlvZ6tlbjNuHMTp2f3EY1p59GroL9sxakiADc1SSJL5EeB6DzfTPT9_qO81t3iClmClubUMQzTXltq53rc8Z6N6ySN-G',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2jjINy6X9ZmAL4TH-7YZv-jAgM_DqAMy5Qi-pLg2WQMKDfgkZCbrbIbaGZ_Bga_TcYvpHAr3lifqniq4w2QOfFeiyPuCMosLCCBZ_HjaaT7pwxS9s48nF2zz22_ic3IEbtbGojgJR9lDAhajnBAVWDQT3In_cQC2EBfnbNUQ3fM4cVQycrlvZ6tlbjNuHMTp2f3EY1p59GroL9sxakiADc1SSJL5EeB6DzfTPT9_qO81t3iClmClubUMQzTXltq53rc8Z6N6ySN-G',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuB2jjINy6X9ZmAL4TH-7YZv-jAgM_DqAMy5Qi-pLg2WQMKDfgkZCbrbIbaGZ_Bga_TcYvpHAr3lifqniq4w2QOfFeiyPuCMosLCCBZ_HjaaT7pwxS9s48nF2zz22_ic3IEbtbGojgJR9lDAhajnBAVWDQT3In_cQC2EBfnbNUQ3fM4cVQycrlvZ6tlbjNuHMTp2f3EY1p59GroL9sxakiADc1SSJL5EeB6DzfTPT9_qO81t3iClmClubUMQzTXltq53rc8Z6N6ySN-G',
        ],
        colors: [
            { id: 'warm-ivory', name: 'Warm Ivory', hex: '#F5EDE0' },
            { id: 'dusty-rose', name: 'Dusty Rose', hex: '#C9A9A6' },
            { id: 'sage', name: 'Sage', hex: '#9CAF88' }
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        details: [
            '100% Organic Cotton Poplin',
            'Smocked elastic bodice',
            'Side seam pockets',
            'Button-front closure',
            'Machine wash cold'
        ],
        rating: 4.9,
        reviewCount: 73
    },
    {
        id: 11,
        slug: 'minimal-leather-loafers',
        name: 'Minimal Leather Loafers',
        description: 'Handcrafted Italian leather loafers with a sleek, minimalist design. Features a comfortable cushioned insole and durable leather sole.',
        price: 320.0,
        category: 'Footwear',
        gender: 'men',
        mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDtguZAV7TBALXLtTufILyZZSf6xZS7-FAWar0pFGdHw81JRdTFDvsVNwGzi57CpHS1cOkvWi4N5Sb1nr_F7PjKkgfe4nu5ZF6M32Zd5pQ5kiMdMICAOy9lkvnmfRFo5A1Jl_zY9CGNLa2Mvbmmkqv3o_rIttcvyZf1yTFnxEbTUZgFRJNHfWho98bcNGsphyVGdmUGCdBuLLmPMwm-IDq7YHN5Uw-16SYW2p4w46XYxFrY6t0EOmGfoL0GS3nMJjcz6O6F5x6VySzE',
        ],
        colors: [
            { id: 'espresso-brown', name: 'Espresso Brown', hex: '#4A3728' },
            { id: 'black', name: 'Black', hex: '#1A1A1A' },
            { id: 'tan', name: 'Tan', hex: '#D2A679' }
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        details: [
            '100% Italian Full-grain Leather',
            'Leather sole with rubber heel tap',
            'Cork-filled footbed',
            'Hand-stitched detailing',
            'Made in Italy'
        ],
        rating: 4.7,
        reviewCount: 95
    },
    {
        id: 12,
        slug: 'wool-blend-midi-skirt',
        name: 'Wool Blend Midi Skirt',
        description: 'Elegant A-line midi skirt in a substantial wool blend. Features a comfortable elastic waistband and falls gracefully below the knee.',
        price: 190.0,
        category: 'Bottoms',
        gender: 'women',
        mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFfEXdLOobvy4SRYxnJBWoUp7RT-yAPzzxFmBeBmW2kpipxFmX9EzshjdkL4o5iy7KVxSnQXQc47Hz0Dlk8p_H9h63qIimN97JwTi7UCj0mmBa7oJRmeLSIuxwTH43imRMcDv2DJ4IzrJHva6cafhZtWY5aS_Ir3jATghtSXkW7SjcZhZWXJDk-ubt9j_qTU9182qXaIK5cM8dKRsb5_meNqMvc1VsIAaJ4PE_r456ITS4-LOCl__PnQDxoOPRxmbFOVM9t9Fr789b',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFfEXdLOobvy4SRYxnJBWoUp7RT-yAPzzxFmBeBmW2kpipxFmX9EzshjdkL4o5iy7KVxSnQXQc47Hz0Dlk8p_H9h63qIimN97JwTi7UCj0mmBa7oJRmeLSIuxwTH43imRMcDv2DJ4IzrJHva6cafhZtWY5aS_Ir3jATghtSXkW7SjcZhZWXJDk-ubt9j_qTU9182qXaIK5cM8dKRsb5_meNqMvc1VsIAaJ4PE_r456ITS4-LOCl__PnQDxoOPRxmbFOVM9t9Fr789b',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCFfEXdLOobvy4SRYxnJBWoUp7RT-yAPzzxFmBeBmW2kpipxFmX9EzshjdkL4o5iy7KVxSnQXQc47Hz0Dlk8p_H9h63qIimN97JwTi7UCj0mmBa7oJRmeLSIuxwTH43imRMcDv2DJ4IzrJHva6cafhZtWY5aS_Ir3jATghtSXkW7SjcZhZWXJDk-ubt9j_qTU9182qXaIK5cM8dKRsb5_meNqMvc1VsIAaJ4PE_r456ITS4-LOCl__PnQDxoOPRxmbFOVM9t9Fr789b',
        ],
        colors: [
            { id: 'graphite', name: 'Graphite', hex: '#4A4D4A' },
            { id: 'charcoal', name: 'Charcoal', hex: '#36454F' },
            { id: 'camel', name: 'Camel', hex: '#C19A6B' }
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        details: [
            '60% Wool, 35% Polyester, 5% Other fibers',
            'Elastic waistband',
            'Side zip closure',
            'Center back slit',
            'Dry clean only'
        ],
        rating: 4.6,
        reviewCount: 41
    },
    {
        id: 13,
        slug: 'classic-trench-coat',
        name: 'Classic Trench Coat',
        description: 'Timeless trench coat in water-resistant cotton gabardine. Features epaulets, gun flap, and belted waist for a classic British heritage look.',
        price: 410.0,
        category: 'Outerwear',
        gender: 'unisex',
        mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEJdtkthRNwQ0GOEkyVsi9MtMOxr7jk5OcgitCK-fbOEVovDDtu3TXJb2rhV4OUsg0wjfnz7GHc2SyxmIm_TcmFo3FdYoYfMfS0rOW_AFHLERCuR5O-FU6oYRiWFwpckIVrrXN2LdqdJwiuj2royCRAvB4Sqdrs4u7QqpMQH-s74hXPdkWJ_3c5AhwEYV6N2d52qAhw1Nr68hXfKNGeadMQmamYDJsQkNomAobOBh3EkM77ShWMoZvACotu6IjTx485iSycVKQ4-Xh',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEJdtkthRNwQ0GOEkyVsi9MtMOxr7jk5OcgitCK-fbOEVovDDtu3TXJb2rhV4OUsg0wjfnz7GHc2SyxmIm_TcmFo3FdYoYfMfS0rOW_AFHLERCuR5O-FU6oYRiWFwpckIVrrXN2LdqdJwiuj2royCRAvB4Sqdrs4u7QqpMQH-s74hXPdkWJ_3c5AhwEYV6N2d52qAhw1Nr68hXfKNGeadMQmamYDJsQkNomAobOBh3EkM77ShWMoZvACotu6IjTx485iSycVKQ4-Xh',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBEJdtkthRNwQ0GOEkyVsi9MtMOxr7jk5OcgitCK-fbOEVovDDtu3TXJb2rhV4OUsg0wjfnz7GHc2SyxmIm_TcmFo3FdYoYfMfS0rOW_AFHLERCuR5O-FU6oYRiWFwpckIVrrXN2LdqdJwiuj2royCRAvB4Sqdrs4u7QqpMQH-s74hXPdkWJ_3c5AhwEYV6N2d52qAhw1Nr68hXfKNGeadMQmamYDJsQkNomAobOBh3EkM77ShWMoZvACotu6IjTx485iSycVKQ4-Xh',
        ],
        colors: [
            { id: 'dusty-camel', name: 'Dusty Camel', hex: '#B88D62' },
            { id: 'black', name: 'Black', hex: '#1A1A1A' },
            { id: 'navy', name: 'Navy', hex: '#1B2A4A' }
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        details: [
            '100% Cotton Gabardine',
            'Water-repellent finish',
            'Removable lining',
            'Double-breasted closure',
            'Made in England'
        ],
        rating: 4.9,
        reviewCount: 156
    },
    {
        id: 14,
        slug: 'soft-structure-blazer',
        name: 'Soft Structure Blazer',
        description: 'Unstructured blazer in a luxurious wool-cashmere blend. Features a soft shoulder, patch pockets, and a relaxed fit that works for any occasion.',
        price: 275.0,
        category: 'Outerwear',
        gender: 'unisex',
        mainImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2jjINy6X9ZmAL4TH-7YZv-jAgM_DqAMy5Qi-pLg2WQMKDfgkZCbrbIbaGZ_Bga_TcYvpHAr3lifqniq4w2QOfFeiyPuCMosLCCBZ_HjaaT7pwxS9s48nF2zz22_ic3IEbtbGojgJR9lDAhajnBAVWDQT3In_cQC2EBfnbNUQ3fM4cVQycrlvZ6tlbjNuHMTp2f3EY1p59GroL9sxakiADc1SSJL5EeB6DzfTPT9_qO81t3iClmClubUMQzTXltq53rc8Z6N6ySN-G',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2jjINy6X9ZmAL4TH-7YZv-jAgM_DqAMy5Qi-pLg2WQMKDfgkZCbrbIbaGZ_Bga_TcYvpHAr3lifqniq4w2QOfFeiyPuCMosLCCBZ_HjaaT7pwxS9s48nF2zz22_ic3IEbtbGojgJR9lDAhajnBAVWDQT3In_cQC2EBfnbNUQ3fM4cVQycrlvZ6tlbjNuHMTp2f3EY1p59GroL9sxakiADc1SSJL5EeB6DzfTPT9_qO81t3iClmClubUMQzTXltq53rc8Z6N6ySN-G',
        images: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuB2jjINy6X9ZmAL4TH-7YZv-jAgM_DqAMy5Qi-pLg2WQMKDfgkZCbrbIbaGZ_Bga_TcYvpHAr3lifqniq4w2QOfFeiyPuCMosLCCBZ_HjaaT7pwxS9s48nF2zz22_ic3IEbtbGojgJR9lDAhajnBAVWDQT3In_cQC2EBfnbNUQ3fM4cVQycrlvZ6tlbjNuHMTp2f3EY1p59GroL9sxakiADc1SSJL5EeB6DzfTPT9_qO81t3iClmClubUMQzTXltq53rc8Z6N6ySN-G',
        ],
        colors: [
            { id: 'slate-blue', name: 'Slate Blue', hex: '#5B7B8A' },
            { id: 'charcoal', name: 'Charcoal', hex: '#36454F' },
            { id: 'beige', name: 'Beige', hex: '#F5F5DC' }
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        details: [
            '85% Wool, 15% Cashmere',
            'Unstructured, soft shoulder',
            'Patch pockets',
            'Notch lapel',
            'Dry clean only'
        ],
        rating: 4.8,
        reviewCount: 68
    }
];
export async function getProductById(id: number): Promise<Product | undefined> {
    return allProducts.find((p) => p.id === id);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
    return allProducts.find((p) => p.slug === slug);
}
