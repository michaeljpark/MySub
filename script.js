document.addEventListener('DOMContentLoaded', () => {
    // Refs
    const viewLogin = document.getElementById('view-login');
    const mainApp = document.getElementById('main-app');
    const viewDashboard = document.getElementById('desktop-view-dashboard');
    const viewHeatmap = document.getElementById('desktop-view-heatmap');
    const viewCredit = document.getElementById('desktop-view-credit');
    const viewDiscounter = document.getElementById('desktop-view-discounter');
    const bottomNav = document.getElementById('bottom-nav');

    // Desktop Refs (Hoisted)
    const desktopNavDashboard = document.getElementById('desktop-nav-dashboard');
    const desktopNavAnalytics = document.getElementById('desktop-nav-analytics');
    const desktopNavCredit = document.getElementById('desktop-nav-credit');
    
    const desktopViewDashboard = document.getElementById('desktop-view-dashboard');
    const desktopViewHeatmap = document.getElementById('desktop-view-heatmap');
    const desktopViewCredit = document.getElementById('desktop-view-credit');
    const desktopViewDiscounter = document.getElementById('desktop-view-discounter');
    
    // Buttons
    const btnLoginBank = document.getElementById('btn-login-bank');
    const bankSelect = document.getElementById('bank-select'); // Bank Select Ref
    const bankLogoDisplay = document.getElementById('bank-logo-display'); // New Logo Container
    const btnLoginEmail = document.getElementById('btn-login-email');
    const btnBackDashboard = document.querySelectorAll('.btn-back-dashboard');
    const btnOpenDiscounter = document.getElementById('btn-open-discounter');
    const btnBackCredit = document.querySelector('.btn-back-credit');
    const navItems = document.querySelectorAll('.nav-item');
    const btnOpenFastRecap = document.getElementById('btn-open-fast-recap');
    const btnOpenFastRecapAnalytics = document.getElementById('btn-open-fast-recap-analytics');

    // Init
    let currentView = 'login';
    let currentTab = 'dashboard';

    // Global Data
    let bank = localStorage.getItem('selectedBank') || 'bmo'; // Default bank selection from Storage
    const brands = {
        bmo: { color: '#0079C1', logo: 'BMO_Logo.svg', guarantee: 'BMO Digital Banking Security Guarantee' },
        cibc: { color: '#C41F3E', logo: 'CIBC_logo_2021.svg', guarantee: 'CIBC Digital Banking Guarantee' },
        rbc: { color: '#005DAA', logo: 'rbc-4-logo-svg-vector.svg', guarantee: 'RBC Digital Banking Security Guarantee' },
        scotia: { color: '#EC111A', logo: 'Scotiabank_logo.svg', guarantee: 'Digital Banking Security Guarantee' },
        td: { color: '#00853F', logo: 'Toronto-Dominion_Bank_logo.svg', guarantee: 'TD Online and Mobile Security Guarantee' }
    };

    // Helper: Hex to RGB channels (e.g. "0 133 63")
    function hexToRgbChannels(hex) {
        let r = 0, g = 0, b = 0;
        // Handle 3 char hex
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        return `${r} ${g} ${b}`;
    }

    // Function to update global theme
    function updateBankTheme(bankKey) {
        const brandData = brands[bankKey];
        if (!brandData) return;

        // Update CSS Variables
        const rgbChannels = hexToRgbChannels(brandData.color);
        document.documentElement.style.setProperty('--color-primary', rgbChannels);
        document.documentElement.style.setProperty('--color-primary-green', rgbChannels);
        document.documentElement.style.setProperty('--color-primary-dark', rgbChannels);

        // Sidebar Background (Medium-light gray-toned bank color)
        // Mix roughly 20% bank color with standard gray background
        document.documentElement.style.setProperty('--sidebar-bg', `rgba(${rgbChannels}, 0.2)`);

        // Update User Plan Info in Sidebar
        const planInfo = document.getElementById('user-plan-info');
        if (planInfo) {
            const displayNames = {
                bmo: 'BMO',
                cibc: 'CIBC',
                rbc: 'RBC',
                scotia: 'Scotiabank',
                td: 'TD'
            };
            const name = displayNames[bankKey] || 'Bank';
            // Random 4 digits for realism or fixed
            planInfo.textContent = `${name}-****`; 
            planInfo.style.fontFamily = 'inherit'; 
        }
    }

    // Check Skip Login Logic
    if (localStorage.getItem('skipLogin') === 'true') {
        localStorage.removeItem('skipLogin');
        
        // Apply Theme
        updateBankTheme(bank);

        // Switch View
        showApp();
    }

    // Global function to open Subscription Detail Modal
    window.openSubModal = (card) => {
        const modal = document.getElementById('subscription-modal');
        const img = document.getElementById('modal-img');
        const title = document.getElementById('modal-title');
        const price = document.getElementById('modal-price');
        const status = document.getElementById('modal-status');
        const info = document.getElementById('modal-info');
        
        // Populate Data
        img.src = card.dataset.img;
        title.textContent = card.dataset.name;
        price.textContent = card.dataset.price;
        status.textContent = card.dataset.status;
        info.textContent = card.dataset.info;
        
        // Show
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    };

    // Close Modal Logic
    const closeModalBtn = document.getElementById('close-modal-btn');
    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
             const modal = document.getElementById('subscription-modal');
             modal.classList.add('hidden');
             modal.classList.remove('flex');
        });
    }

    // Close on outside click
    const subModal = document.getElementById('subscription-modal');
    if(subModal) {
        subModal.addEventListener('click', (e) => {
            if(e.target === subModal) {
                subModal.classList.add('hidden');
                subModal.classList.remove('flex');
            }
        });
    }

    function showApp() {
        viewLogin.classList.add('hidden');
        mainApp.classList.remove('hidden');
        // mainApp is a block container by default, no need for flex unless centering children specifically
        // mainApp.classList.add('flex'); 
        switchTab('dashboard');
    }

    function switchTab(tabName) {
        currentTab = tabName;

        // Reset Nav
        resetNavStyles();

        // Show specific view using Desktop Logic
        if (tabName === 'dashboard') {
            switchDesktopView('desktop-view-dashboard');
            setActiveNav(0);
        } else if (tabName === 'heatmap') {
            switchDesktopView('desktop-view-heatmap');
            setActiveNav(2);
        } else if (tabName === 'credit') {
             switchDesktopView('desktop-view-credit');
             setActiveNav(1); 
        } else if (tabName === 'discounter') {
             switchDesktopView('desktop-view-discounter');
             setActiveNav(1);
        } else if (tabName === 'profile') {
             switchDesktopView('desktop-view-dashboard');
             setActiveNav(3);
        }
    }

    function resetNavStyles() {
        navItems.forEach(item => {
            const iconContainer = item.querySelector('.icon-container');
            const icon = item.querySelector('svg');
            const label = item.querySelector('.label');

            // Reset classes to inactive state (gray)
            iconContainer.classList.remove('bg-primary-green/10');
            iconContainer.classList.add('bg-transparent');
            
            if (icon) {
                icon.classList.remove('text-primary-green', 'filled');
                icon.classList.add('text-gray-400');
            }
            
            label.classList.remove('text-primary-green', 'font-bold');
            label.classList.add('text-gray-400', 'font-medium');
        });
    }

    function setActiveNav(index) {
        if (!navItems[index]) return;
        const item = navItems[index];

        const iconContainer = item.querySelector('.icon-container');
        const icon = item.querySelector('svg');
        const label = item.querySelector('.label');

        // Set Active Styles
        iconContainer.classList.remove('bg-transparent');
        iconContainer.classList.add('bg-primary-green/10');

        if (icon) {
            icon.classList.remove('text-gray-400');
            icon.classList.add('text-primary-green', 'filled');
        }

        label.classList.remove('text-gray-400', 'font-medium');
        label.classList.add('text-primary-green', 'font-bold');
    }

    // Event Listeners
    if (bankSelect) {
        // Init Select Value
        bankSelect.value = bank;
        
        bankSelect.addEventListener('change', (e) => {
            bank = e.target.value; // Update Global Bank Variable
            localStorage.setItem('selectedBank', bank); // Save to Storage
            const btn = btnLoginBank;
            
            // Allow Logic - Button becomes standardized gray/black
            btn.disabled = false;
            btn.classList.remove('bg-gray-200', 'dark:bg-white/5', 'text-gray-400', 'dark:text-gray-500', 'cursor-not-allowed', 'shadow-none');
            // Add active styles (Base styles) - ADD bg-primary here
            btn.classList.add('bg-primary', 'text-white', 'shadow-lg', 'active:scale-[0.98]', 'cursor-pointer');
            
            // Clear any inline styles
            btn.style.backgroundColor = '';
            btn.style.boxShadow = '';
            btn.style.filter = '';
            btn.onmouseenter = null;
            btn.onmouseleave = null;

            const brandData = brands[bank];
            
            if (brandData) {
                // Update Global Theme
                updateBankTheme(bank); // Use shared function

                // Set Color (Buttons/Inline Styles need explicit rgb/hex or variable with wrapper)
                // Since we changed vars to just numbers, we can't use var(--color-primary) directly in background: ... without rgb() wrapper
                // But here we use brandData.color (HEX) which is fine.
                btn.style.backgroundColor = brandData.color;
                btn.style.boxShadow = `0 10px 15px -3px ${brandData.color}40, 0 4px 6px -4px ${brandData.color}20`;
                
                // Hover effect
                btn.onmouseenter = () => { btn.style.filter = 'brightness(0.9)'; };
                btn.onmouseleave = () => { btn.style.filter = 'brightness(1)'; };

                // Show Logo in Separate Container (Between MySub and Text)
                if (bankLogoDisplay) {
                    bankLogoDisplay.classList.remove('hidden');
                    bankLogoDisplay.classList.add('flex');
                    bankLogoDisplay.innerHTML = `<img src="${brandData.logo}" alt="${bank} logo" class="h-12 object-contain filter-none">`;
                }

                // Update Blur Background
                const blurBg = document.getElementById('login-blur-bg');
                if (blurBg) {
                    blurBg.style.backgroundColor = brandData.color;
                    blurBg.style.opacity = '0.25';
                }
                
                // Update Linked Badge Text in Dashboard
                const bankLinkedText = document.getElementById('bank-linked-text');
                if (bankLinkedText) {
                    // Map bank keys to display names
                    const bankNames = {
                        bmo: "BMO",
                        cibc: "CIBC",
                        rbc: "RBC",
                        scotia: "Scotiabank",
                        td: "TD Canada Trust"
                    };
                    bankLinkedText.textContent = `${bankNames[bank] || 'Bank'} Account Linked`;
                }

                // Update Security Icon Color
                const securityIcon = document.getElementById('security-icon');
                if (securityIcon) {
                    securityIcon.style.color = brandData.color;
                    // Remove default gray class if needed, though inline style overrides it
                    securityIcon.classList.remove('text-gray-400');
                }

                // Update Security Text
                const securityText = document.getElementById('security-text');
                if (securityText) {
                    securityText.textContent = brandData.guarantee;
                }

                // Update Fast Recap Button Style
                if (btnOpenFastRecap) {
                     // Remove existing color classes
                     btnOpenFastRecap.classList.remove('bg-yellow-50', 'dark:bg-yellow-900/20', 'text-yellow-600', 'dark:text-yellow-400', 'hover:bg-yellow-100', 'dark:hover:bg-yellow-900/30');
                     
                     // Apply dynamic styles (Solid Brand bg, White Text)
                     btnOpenFastRecap.style.transition = 'all 0.3s ease';
                     btnOpenFastRecap.style.backgroundColor = brandData.color;
                     btnOpenFastRecap.style.color = '#ffffff';
                     
                     btnOpenFastRecap.onmouseenter = () => { 
                        btnOpenFastRecap.style.opacity = '0.9'; 
                     };
                     btnOpenFastRecap.onmouseleave = () => { 
                        btnOpenFastRecap.style.opacity = '1'; 
                     };
                }

                // Update Fast Recap Analytics Button Style
                if (btnOpenFastRecapAnalytics) {
                    btnOpenFastRecapAnalytics.style.backgroundColor = brandData.color;
                    btnOpenFastRecapAnalytics.onmouseenter = () => { 
                        btnOpenFastRecapAnalytics.style.filter = 'brightness(0.9)'; 
                    };
                    btnOpenFastRecapAnalytics.onmouseleave = () => { 
                        btnOpenFastRecapAnalytics.style.filter = 'brightness(1)'; 
                    };
                }

                // --- Update Inquiry Card (Mobile & Desktop) ---
                const bankNameDisplay = brands[bank].logo.includes('BMO') ? 'BMO' : 
                                      brands[bank].logo.includes('CIBC') ? 'CIBC' :
                                      brands[bank].logo.includes('rbc') ? 'RBC' :
                                      brands[bank].logo.includes('Scotia') ? 'Scotiabank' :
                                      brands[bank].logo.includes('Toronto') ? 'TD' : 'Bank';
                
                // Update Text
                const mobBankName = document.getElementById('analytics-bank-name');
                const deskBankNames = document.querySelectorAll('.desk-analytics-bank-name');
                
                if (mobBankName) mobBankName.textContent = bankNameDisplay;
                deskBankNames.forEach(el => el.textContent = bankNameDisplay);

                // Update Background & Text Colors
                const mobInquiryCard = document.getElementById('mobile-inquiry-card');
                const deskInquiryCard = document.getElementById('desktop-inquiry-card');

                const updateInquiryStyle = (card) => {
                    if (!card) return;
                    // Remove default blue gradient class to avoid conflict
                    card.classList.remove('from-blue-600', 'to-blue-500', 'bg-gradient-to-r');
                    
                    // Apply new gradient programmatically: Dark -> Bank Color
                    const rgbStr = hexToRgbChannels(brandData.color).split(' ').join(',');
                    
                    // "Natural" moving light effect
                    card.style.backgroundColor = '#0f172a'; 
                    // Gradient anchored at center of the *background image*, which is larger than the card
                    card.style.backgroundImage = `radial-gradient(circle at 50% 50%, rgba(${rgbStr}, 0.6), rgba(${rgbStr}, 0.15) 50%, transparent 70%)`;
                    card.style.backgroundSize = '200% 200%';
                    card.style.animation = 'slow-pan 12s ease-in-out infinite alternate'; // Move back and forth
                    
                    // Update the button inside to match text color of brand
                    const btn = card.querySelector('button');
                    if (btn) {
                        // Button text color: Brand Color (on white bg)
                        btn.style.color = brandData.color; 
                        btn.classList.remove('text-blue-600');
                    }
                    
                    // Remove/Hide the static white blur orb (bg-white/20) if present
                    const whiteBlur = card.querySelector('.bg-white\\/20');
                    if (whiteBlur) {
                        whiteBlur.style.display = 'none';
                    }
                };
                
                updateInquiryStyle(mobInquiryCard);
                updateInquiryStyle(deskInquiryCard);

                // Update Analyst Saying Button Style
                const btnAnalystRec = document.getElementById('btn-analyst-recommendation');
                if (btnAnalystRec) {
                    btnAnalystRec.classList.remove('bg-blue-600', 'hover:bg-blue-700', 'shadow-blue-200');
                    btnAnalystRec.style.backgroundColor = brandData.color;
                    btnAnalystRec.style.boxShadow = `0 4px 6px -1px ${brandData.color}40, 0 2px 4px -1px ${brandData.color}20`; // Colored shadow
                    
                    btnAnalystRec.onmouseenter = () => { 
                        btnAnalystRec.style.filter = 'brightness(0.9)'; 
                    };
                    btnAnalystRec.onmouseleave = () => { 
                        btnAnalystRec.style.filter = 'brightness(1)'; 
                    };
                }

                // Update Credit Vault Gradient Animation
                const creditBgLayer = document.getElementById('credit-card-bg-layer');
                if (creditBgLayer) {
                    const c = brandData.color;
                    const rgb = hexToRgbChannels(c);
                    // Use tinted darks to preserve brand hue
                    const darkBrand = `rgba(${rgb.split(' ').join(',')}, 0.2)`; 
                    const darkerBrand = `rgba(${rgb.split(' ').join(',')}, 0.1)`; 

                    // Remove image overlay, focus on pure gradient
                    creditBgLayer.style.backgroundBlendMode = 'normal';
                    creditBgLayer.style.opacity = '1';
                    
                    // Gradient: Soft Radial for a natural spotlight effect
                    // Using larger spread (60% / 100%) for smoother transition
                    creditBgLayer.style.backgroundImage = `radial-gradient(circle at top right, ${c} 0%, ${darkBrand} 60%, ${darkerBrand} 100%)`;
                    
                    // Restore motion (random-drift), but remove 'breathe' (brightness flickering)
                    creditBgLayer.style.animation = 'random-drift 20s ease-in-out infinite';
                    
                    // Gradient gets 150% size - large enough to move
                    creditBgLayer.style.backgroundSize = '170% 170%';
                }


            } else {
                 // If invalid selection, revert to default icon
                 if (bankLogoDisplay) {
                     bankLogoDisplay.classList.remove('hidden');
                     bankLogoDisplay.classList.add('flex');
                     bankLogoDisplay.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-landmark-icon lucide-landmark"><path d="M10 18v-7"/><path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M3 22h18"/><path d="M6 18v-7"/></svg>`;
                 }
                 
                 // Reset Blur Background
                 const blurBg = document.getElementById('login-blur-bg');
                 if (blurBg) {
                     blurBg.style.backgroundColor = '';
                     blurBg.style.opacity = '';
                 }

                 // Reset Security Icon Color
                 const securityIcon = document.getElementById('security-icon');
                 if (securityIcon) {
                     securityIcon.style.color = '';
                     securityIcon.classList.add('text-gray-400');
                 }

                 // Reset Security Text
                 const securityText = document.getElementById('security-text');
                 if (securityText) {
                     securityText.textContent = 'Bank-grade 256-bit encryption';
                 }

                 // Reset Global Theme/Colors
                 document.documentElement.style.removeProperty('--color-primary');
                 document.documentElement.style.removeProperty('--color-primary-green');
                 document.documentElement.style.removeProperty('--color-primary-dark');

                 // Reset Button Styles
                 btn.classList.add('bg-gray-200', 'dark:bg-white/5', 'text-gray-400', 'dark:text-gray-500', 'cursor-not-allowed', 'shadow-none');
                 btn.classList.remove('bg-primary', 'text-white', 'shadow-lg', 'active:scale-[0.98]', 'cursor-pointer');
                 btn.disabled = true;
                 btn.style.backgroundColor = '';
                 btn.style.boxShadow = '';
            }
        });
    }

    if (btnLoginBank) btnLoginBank.addEventListener('click', showApp);
    if (btnLoginEmail) btnLoginEmail.addEventListener('click', showApp);

    btnBackDashboard.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab('dashboard');
        });
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.target;
            switchTab(target);
        });
    });

    // --- Desktop Navigation ---
    // Refs moved to top for hoisting support

    function updateDesktopNavStyles(active, ...inactives) {
        if (!active) return;
        // Active Style
        active.classList.add('bg-primary-green/10', 'text-primary-green');
        active.classList.remove('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-50', 'dark:hover:bg-white/5');
        const iconA = active.querySelector('svg');
        if(iconA) iconA.classList.add('filled');

        // Inactive Styles
        inactives.forEach(inactive => {
            if(!inactive) return;
            inactive.classList.remove('bg-primary-green/10', 'text-primary-green');
            inactive.classList.add('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-50', 'dark:hover:bg-white/5');
            const iconI = inactive.querySelector('svg');
            if(iconI) iconI.classList.remove('filled');
        });
    }

    function switchDesktopView(viewId) {
        // 1. Force Hide All
        if(desktopViewDashboard) {
            desktopViewDashboard.classList.add('hidden');
            desktopViewDashboard.classList.remove('flex'); 
        }
        if(desktopViewHeatmap) {
            desktopViewHeatmap.classList.add('hidden');
            desktopViewHeatmap.classList.remove('flex');
        }
        if(desktopViewCredit) {
             desktopViewCredit.classList.add('hidden');
             desktopViewCredit.classList.remove('flex');
        }
        if(desktopViewDiscounter) {
             desktopViewDiscounter.classList.add('hidden');
             desktopViewDiscounter.classList.remove('flex');
        }

        // 2. Show Target
        const target = document.getElementById(viewId);
        if(target) {
            target.classList.remove('hidden');
            target.classList.add('flex');
            
            // Scroll to top of desktop main area
            const desktopMain = document.querySelector('#desktop-layout main');
            if (desktopMain) desktopMain.scrollTop = 0;
        }
    }

    if (desktopNavDashboard) {
         desktopNavDashboard.addEventListener('click', (e) => {
            e.preventDefault();
            switchDesktopView('desktop-view-dashboard');
            updateDesktopNavStyles(desktopNavDashboard, desktopNavAnalytics, desktopNavCredit);
        });
    }
    if (desktopNavAnalytics) {
        desktopNavAnalytics.addEventListener('click', (e) => {
             e.preventDefault();
             switchDesktopView('desktop-view-heatmap');
             updateDesktopNavStyles(desktopNavAnalytics, desktopNavDashboard, desktopNavCredit);
        });
    }
    if (desktopNavCredit) {
        desktopNavCredit.addEventListener('click', (e) => {
             e.preventDefault();
             switchDesktopView('desktop-view-credit');
             updateDesktopNavStyles(desktopNavCredit, desktopNavDashboard, desktopNavAnalytics);
        });
    }

    // --- Calculator Logic ---
    // Mobile
    const calcSelectService = document.getElementById('calc-select-service');
    const calcSelectCredit = document.getElementById('calc-select-credit');
    const calcFinalPrice = document.getElementById('calc-final-price');

    // Desktop
    const deskSelectService = document.getElementById('desktop-calc-select-service');
    const deskSelectCredit = document.getElementById('desktop-calc-select-credit');
    const deskFinalPrice = document.getElementById('desktop-calc-final-price');

    function calculateDiscount(serviceSel, creditSel, output) {
        if(!serviceSel || !creditSel || !output) return;

        const serviceCost = parseFloat(serviceSel.value) || 0;
        const creditVal = parseFloat(creditSel.value) || 0;

        const final = Math.max(0, serviceCost - creditVal);
        output.textContent = `$${final.toFixed(2)}`;
    }

    function initCalculator(sDict, cDict, output) {
        // Run once on init
        calculateDiscount(sDict, cDict, output);
        // Add listeners
        sDict.addEventListener('change', () => calculateDiscount(sDict, cDict, output));
        cDict.addEventListener('change', () => calculateDiscount(sDict, cDict, output));
    }

    if(calcSelectService && calcSelectCredit) {
        initCalculator(calcSelectService, calcSelectCredit, calcFinalPrice);
    }
    if(deskSelectService && deskSelectCredit) {
        initCalculator(deskSelectService, deskSelectCredit, deskFinalPrice);
    }

    // --- Heatmap Logic ---
    // Mobile Refs
    const mobileMonthLabel = document.getElementById('heatmap-month-label');
    const mobileDaysContainer = document.getElementById('heatmap-days-container');
    const mobilePrev = document.getElementById('heatmap-prev-month');
    const mobileNext = document.getElementById('heatmap-next-month');

    // Desktop Refs (Collection)
    const desktopMonthLabels = document.querySelectorAll('.js-heatmap-month-label');
    const desktopDaysContainers = document.querySelectorAll('.js-heatmap-days-container');
    const desktopPrevs = document.querySelectorAll('.js-heatmap-prev');
    const desktopNexts = document.querySelectorAll('.js-heatmap-next');

    let currentHeatmapDate = new Date(); // Start with today
    // Normalize to 1st of month to avoid overflow issues (e.g. going from Mar 31 to Feb)
    currentHeatmapDate.setDate(1); 
    
    const today = new Date();

    function createDayElement(d, month, year, isFuture, intensity, isToday) {
        const dayBtn = document.createElement('button');
        dayBtn.className = "aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 border border-transparent";
        dayBtn.textContent = d;

        // Apply Styling based on intensity
        if (intensity === 0) {
            if (isFuture) {
                    dayBtn.classList.add('text-gray-300', 'dark:text-gray-700', 'cursor-default');
            } else {
                    dayBtn.classList.add('text-text-sub-light', 'dark:text-text-sub-dark', 'hover:bg-gray-100', 'dark:hover:bg-white/10');
            }
        } else if (intensity === 1) {
            // Lightest tint of primary green
            dayBtn.classList.add('bg-primary-green/10', 'text-primary-dark', 'dark:bg-primary-green/20', 'dark:text-green-100');
        } else if (intensity === 2) {
            // Light tint
            dayBtn.classList.add('bg-primary-green/30', 'text-primary-dark', 'dark:bg-primary-green/40', 'dark:text-white');
        } else if (intensity === 3) {
            // Medium tint
            dayBtn.classList.add('bg-primary-green/60', 'text-white', 'dark:bg-primary-green/70');
        } else if (intensity === 4) {
            // Full color
            dayBtn.classList.add('bg-primary-green', 'text-white', 'shadow-md', 'shadow-primary/30');
        }

        // Today Marker (Overlay)
        if (isToday) {
            dayBtn.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'dark:ring-offset-background-dark', 'font-bold');
            // Ensure today is at least visible (optional, but prevents empty ring)
            if (intensity === 0) {
                    dayBtn.classList.remove('text-text-sub-light', 'dark:text-text-sub-dark');
                    dayBtn.classList.add('text-primary'); 
            }
        }
        return dayBtn;
    }

    function renderHeatmaps() {
        const year = currentHeatmapDate.getFullYear();
        const month = currentHeatmapDate.getMonth(); // 0-indexed

        // Update Labels (e.g., "September 2024")
        const monthName = currentHeatmapDate.toLocaleString('default', { month: 'long' });
        const labelText = `${monthName} ${year}`;
        
        if (mobileMonthLabel) mobileMonthLabel.textContent = labelText;
        desktopMonthLabels.forEach(el => el.textContent = labelText);

        // Disable "Next" if current month is same as or after real current month
        // (Block future months)
        const isCurrentMonthOrLater = year > today.getFullYear() || (year === today.getFullYear() && month >= today.getMonth());
        
        // Update Mobile Buttons
        if (mobileNext) {
            mobileNext.disabled = isCurrentMonthOrLater;
            if (isCurrentMonthOrLater) {
                 mobileNext.classList.add('opacity-30', 'cursor-not-allowed');
            } else {
                 mobileNext.classList.remove('opacity-30', 'cursor-not-allowed');
            }
        }
        
        // Update Desktop Buttons
        desktopNexts.forEach(btn => {
            btn.disabled = isCurrentMonthOrLater;
            if (isCurrentMonthOrLater) {
                 btn.classList.add('opacity-30', 'cursor-not-allowed');
            } else {
                 btn.classList.remove('opacity-30', 'cursor-not-allowed');
            }
        });

        // Generate Days Data
        // First day of this month
        const firstDayOfMonth = new Date(year, month, 1);
        // Day of week (0=Sun, 1=Mon, ...)
        const startDayOfWeek = firstDayOfMonth.getDay();
        // Last day of this month (date=0 of next month)
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

        // Helper to fill ANY container
        const fillContainer = (container) => {
            if(!container) return;
            container.innerHTML = '';

            // Previous month filler
            for (let i = 0; i < startDayOfWeek; i++) {
                const emptyCell = document.createElement('div');
                // optionally style empty cells or leave blank
                container.appendChild(emptyCell);
            }

            // Days
            for (let d = 1; d <= lastDayOfMonth; d++) {
                // Check if this date is "today"
                const isToday = (
                    today.getDate() === d &&
                    today.getMonth() === month &&
                    today.getFullYear() === year
                );

                // Check if future
                const isFuture = (
                    year > today.getFullYear() ||
                    (year === today.getFullYear() && month > today.getMonth()) ||
                    (year === today.getFullYear() && month === today.getMonth() && d > today.getDate())
                );

                // Natural usage simulation (Deterministic random 0-4)
                const seed = year * 10000 + (month + 1) * 100 + d;
                const randomVal = Math.abs(Math.sin(seed)); 
                
                let intensity = 0;
                // Only calculate intensity if not in future
                if (!isFuture) {
                    if (randomVal > 0.40) intensity = 1;
                    if (randomVal > 0.65) intensity = 2;
                    if (randomVal > 0.85) intensity = 3;
                    if (randomVal > 0.95) intensity = 4;
                }
                
                const dayBtn = createDayElement(d, month, year, isFuture, intensity, isToday);
                container.appendChild(dayBtn);
            }
        };

        // Fill Mobile
        fillContainer(mobileDaysContainer);
        // Fill Desktops
        desktopDaysContainers.forEach(c => fillContainer(c));
    }

    function prevMonth() {
        currentHeatmapDate.setMonth(currentHeatmapDate.getMonth() - 1);
        renderHeatmaps();
    }

    function nextMonth() {
        currentHeatmapDate.setMonth(currentHeatmapDate.getMonth() + 1);
        renderHeatmaps();
    }

    // Shared listeners
    if (mobilePrev) mobilePrev.addEventListener('click', prevMonth);
    if (mobileNext) mobileNext.addEventListener('click', nextMonth);
    
    desktopPrevs.forEach(btn => btn.addEventListener('click', prevMonth));
    desktopNexts.forEach(btn => btn.addEventListener('click', nextMonth));

    // Initial Render
    renderHeatmaps();

    // Trigger initial bank selection visual update (e.g. default BMO)
    if (bankSelect && bankSelect.value) {
        bankSelect.dispatchEvent(new Event('change'));
    }

    // --- Discounter Navigation ---
    if (btnOpenDiscounter) {
        btnOpenDiscounter.addEventListener('click', () => {
            switchTab('discounter');
        });
    }

    if (btnBackCredit) {
        btnBackCredit.addEventListener('click', () => {
            switchTab('credit');
        });
    }
    
    // --- Update Dynamic Bank Name in Analytics ---
    const analyticsBankName = document.getElementById('analytics-bank-name');
    if (analyticsBankName && bankSelect) {
         bankSelect.addEventListener('change', (e) => {
             const val = e.target.value;
             const bankNames = {
                 bmo: "BMO",
                 cibc: "CIBC",
                 rbc: "RBC",
                 scotia: "Scotiabank",
                 td: "TD"
             };
             analyticsBankName.textContent = bankNames[val] || 'Bank';
         });
         // Init
         analyticsBankName.textContent = 'BMO'; 
    }
    
    // --- Copy of Calculator Logic for Local calc-select elements ---
    // (Since we moved the HTML, the existing IDs 'calc-select-service' etc are still valid, 
    // but we need to ensure their listeners are attached or re-attached if they were outside checks.
    // The previous read showed logic for 'calcSelectService' etc. was present. 
    // Just need to make sure variable refs are correct if they were defined at top.)
    
    // The original JS defines 'calcSelectService' at the bottom.
    // Since I am appending, I can add fresh listeners or logic if needed.
    // However, the original code for calculator logic was likely at the very end of the file.
    // Let's just ensure we have logic for the calculator.

    const calcService = document.getElementById('calc-select-service');
    const calcCredit  = document.getElementById('calc-select-credit');
    const calcFinal   = document.getElementById('calc-final-price');

    function updateCalc() {
        if(!calcService || !calcCredit || !calcFinal) return;
        const sVal = parseFloat(calcService.value) || 0;
        const cVal = parseFloat(calcCredit.value) || 0;
        let final = sVal - cVal;
        if (final < 0) final = 0;
        calcFinal.textContent = '$' + final.toFixed(2);
    }

    if(calcService) calcService.addEventListener('change', updateCalc);
    if(calcCredit)  calcCredit.addEventListener('change', updateCalc);
    
    // Init calc
    updateCalc();

    // --- Desktop Active Subscriptions Filtering & Logic ---
    const desktopGrid = document.getElementById('desktop-active-subs-grid');
    const desktopSubCount = document.getElementById('desktop-sub-count');
    
    // Mobile Elements
    const mobileList = document.getElementById('mobile-active-subs-list');
    const mobileSubCount = document.getElementById('mobile-sub-count');

    // Desktop Filter Buttons
    const btnFilterAll = document.getElementById('desktop-filter-all');
    const btnFilterDate = document.getElementById('desktop-filter-date');
    const btnFilterPrice = document.getElementById('desktop-filter-price');

    // Mobile Filter Buttons
    const btnMobileFilterAll = document.getElementById('mobile-filter-all');
    const btnMobileFilterDate = document.getElementById('mobile-filter-date');
    const btnMobileFilterPrice = document.getElementById('mobile-filter-price');
    
    // Store original order
    let originalDesktopOrder = [];
    if (desktopGrid) {
        originalDesktopOrder = Array.from(desktopGrid.children);
    }

    let originalMobileOrder = [];
    if (mobileList) {
        originalMobileOrder = Array.from(mobileList.children);
    }

    function updateSubCounts() {
        // Desktop
        if (desktopSubCount && desktopGrid) {
            desktopSubCount.textContent = desktopGrid.children.length;
        }
        // Mobile
        if (mobileSubCount && mobileList) {
            mobileSubCount.textContent = mobileList.children.length; // Count direct children (sub cards)
        }
    }

    // Initial count
    updateSubCounts();

    function setActiveDesktopFilter(activeBtn) {
        const buttons = [btnFilterAll, btnFilterDate, btnFilterPrice];
        
        buttons.forEach(btn => {
            if (!btn) return;
            
            if (btn === activeBtn) {
                // Active State
                // Use 'bg-primary' to follow bank color
                btn.classList.add('bg-primary', 'text-white', 'border-transparent', 'active');
                btn.classList.remove('bg-white', 'dark:bg-white/5', 'text-text-main', 'dark:text-white', 'border-gray-200', 'dark:border-white/10');
            } else {
                // Inactive State
                btn.classList.remove('bg-primary', 'text-white', 'border-transparent', 'active');
                btn.classList.add('bg-white', 'dark:bg-white/5', 'text-text-main', 'dark:text-white', 'border-gray-200', 'dark:border-white/10');
            }
        });
    }

    function setActiveMobileFilter(activeBtn) {
        const buttons = [btnMobileFilterAll, btnMobileFilterDate, btnMobileFilterPrice];

        buttons.forEach(btn => {
            if (!btn) return;

            if (btn === activeBtn) {
                // Active State
                // Use 'bg-primary-green' as requested by user for mobile, following the bank color logic
                btn.classList.add('bg-primary-green', 'text-white');
                btn.classList.remove('bg-white', 'dark:bg-white/5', 'border', 'border-gray-200', 'dark:border-white/10', 'text-text-main', 'dark:text-white');
                 
                // Handle nested spans color
                const icon = btn.querySelector('.material-symbols-outlined');
                if(icon) {
                     icon.classList.remove('text-text-secondary');
                     icon.classList.add('text-white');
                }
                const label = btn.querySelector('span:not(.material-symbols-outlined)');
                if(label) {
                    label.classList.remove('text-text-main', 'dark:text-white');
                    // label.classList.add('text-white'); // inherited
                }

            } else {
                // Inactive State
                btn.classList.remove('bg-primary-green', 'text-white');
                btn.classList.add('bg-white', 'dark:bg-white/5', 'border', 'border-gray-200', 'dark:border-white/10');
                
                const icon = btn.querySelector('.material-symbols-outlined');
                if(icon) {
                     icon.classList.add('text-text-secondary');
                     icon.classList.remove('text-white');
                }
                 const label = btn.querySelector('span:not(.material-symbols-outlined)');
                if(label) {
                    label.classList.add('text-text-main', 'dark:text-white');
                }
            }
        });
    }

    if (desktopGrid) {
        if (btnFilterAll) {
            btnFilterAll.addEventListener('click', () => {
                setActiveDesktopFilter(btnFilterAll);
                // Restore original order
                desktopGrid.innerHTML = '';
                originalDesktopOrder.forEach(el => desktopGrid.appendChild(el));
            });
        }

        if (btnFilterDate) {
            btnFilterDate.addEventListener('click', () => {
                setActiveDesktopFilter(btnFilterDate);
                const cards = Array.from(desktopGrid.children);
                cards.sort((a, b) => {
                    const dateA = new Date(a.dataset.date || '9999-12-31');
                    const dateB = new Date(b.dataset.date || '9999-12-31');
                    return dateA - dateB; // Ascending (soonest first)
                });
                desktopGrid.innerHTML = '';
                cards.forEach(card => desktopGrid.appendChild(card));
            });
        }

        if (btnFilterPrice) {
            btnFilterPrice.addEventListener('click', () => {
                setActiveDesktopFilter(btnFilterPrice);
                const cards = Array.from(desktopGrid.children);
                cards.sort((a, b) => {
                    // Extract numeric price from string like "C$ 27.00" or "CAD 27.00"
                    const getPrice = (el) => {
                        const pStr = el.dataset.price || '0';
                        return parseFloat(pStr.replace(/[^0-9.]/g, ''));
                    };
                    return getPrice(b) - getPrice(a); // Descending (highest price first)
                });
                desktopGrid.innerHTML = '';
                cards.forEach(card => desktopGrid.appendChild(card));
            });
        }
    }

    // --- Mobile Filtering Logic ---
    if (mobileList) {
        if (btnMobileFilterAll) {
            btnMobileFilterAll.addEventListener('click', () => {
                setActiveMobileFilter(btnMobileFilterAll);
                mobileList.innerHTML = '';
                originalMobileOrder.forEach(el => mobileList.appendChild(el));
            });
        }

        if (btnMobileFilterDate) {
            btnMobileFilterDate.addEventListener('click', () => {
                setActiveMobileFilter(btnMobileFilterDate);
                const cards = Array.from(mobileList.children);
                cards.sort((a, b) => {
                    const dateA = new Date(a.dataset.date || '9999-12-31');
                    const dateB = new Date(b.dataset.date || '9999-12-31');
                    return dateA - dateB; 
                });
                mobileList.innerHTML = '';
                cards.forEach(card => mobileList.appendChild(card));
            });
        }

        if (btnMobileFilterPrice) {
            btnMobileFilterPrice.addEventListener('click', () => {
                setActiveMobileFilter(btnMobileFilterPrice);
                const cards = Array.from(mobileList.children);
                cards.sort((a, b) => {
                    const getPrice = (el) => {
                        const pStr = el.dataset.price || '0';
                        return parseFloat(pStr.replace(/[^0-9.]/g, ''));
                    };
                    return getPrice(b) - getPrice(a);
                });
                mobileList.innerHTML = '';
                cards.forEach(card => mobileList.appendChild(card));
            });
        }
    }


    // --- Discounter Desktop Entry ---
    // If we added a new button for desktop discounter opening in previous step
    const btnDesktopOpenDiscounter = document.getElementById('btn-desktop-open-discounter');
    if (btnDesktopOpenDiscounter) {
        btnDesktopOpenDiscounter.addEventListener('click', () => {
             // For now, simpler: Scroll to Calculator section if visible, or toggle view if simulated
             // The user wanted "Credit Discounter and exclusive offer next to Total Unused Value section"
             // which implies they are visible on the dashboard (or credit view).
             // Let's assume this button opens the tool or scrolls to it. 
             // Since specific behavior wasn't detailed, let's just log it or maybe focus the select.
             const serviceSelect = document.getElementById('desktop-calc-select-service');
             if(serviceSelect) serviceSelect.focus();
        });
    }

    // --- Discounter Flow Logic ---
    const stepTerms = document.getElementById('discounter-step-terms');
    const stepLoading = document.getElementById('discounter-step-loading');
    const stepList = document.getElementById('discounter-step-list');
    const btnAcceptTerms = document.getElementById('btn-accept-terms');
    const actionArea = document.getElementById('discounter-action-area');
    const discounterHeaderTitle = document.getElementById('discounter-header-title');

    function resetDiscounterFlow() {
        if(stepTerms) stepTerms.classList.remove('hidden');
        if(stepLoading) stepLoading.classList.add('hidden');
        if(stepList) stepList.classList.add('hidden');
        if(actionArea) actionArea.classList.add('hidden');
    }

    if (btnAcceptTerms) {
        btnAcceptTerms.addEventListener('click', () => {
             // 1. Hide Terms
             if(stepTerms) stepTerms.classList.add('hidden');
             
             // 2. Show Loading
             if(stepLoading) {
                 stepLoading.classList.remove('hidden');
                 stepLoading.classList.add('flex'); // Ensure flex centering
             }

             // 3. Wait 1s then show List
             setTimeout(() => {
                 if(stepLoading) {
                     stepLoading.classList.add('hidden');
                     stepLoading.classList.remove('flex');
                 }
                 if(stepList) stepList.classList.remove('hidden');
                 if(actionArea) actionArea.classList.remove('hidden');
                 
                 // Render list now (or refresh it)
                 renderDiscounterList();
             }, 1500); // 1.5s delay for effect
        });
    }

    // --- Discounter List Logic ---
    function renderDiscounterList() {
        const container = document.getElementById('discounter-list-container');
        const sourceList = document.getElementById('desktop-active-subs-grid');
        const btnApply = document.getElementById('btn-apply-discounter');
        const countBadge = document.getElementById('discounter-count-badge');
        
        if (!container || !sourceList) return;
        
        container.innerHTML = '';
        const sourceCards = Array.from(sourceList.children);
        
        let selectedCount = 0;

        const updateCount = () => {
             const checked = container.querySelectorAll('input[type="checkbox"]:checked').length;
             selectedCount = checked;
             if(countBadge) {
                 countBadge.textContent = selectedCount;
                 if(selectedCount > 0) {
                     countBadge.classList.remove('hidden');
                 } else {
                     countBadge.classList.add('hidden');
                 }
             }
        };

        sourceCards.forEach(sourceCard => {
            const card = sourceCard.cloneNode(true);
            
            // Remove modal interaction
            card.removeAttribute('onclick');
            card.classList.remove('cursor-pointer', 'active:scale-[0.98]');
            
            // Find the header section (Logo + Text)
            // Structure: div.flex.items-center.justify-between > div.flex.items-center.gap-4
            const headerRow = card.querySelector('.flex.items-center.mb-3');
            
            if (headerRow) {
                // Create Checkbox Container
                const checkboxContainer = document.createElement('div');
                checkboxContainer.className = "mr-4 flex items-center";
                
                const checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                // Modern Rounded Style
                checkbox.className = "appearance-none size-6 rounded-full border-2 border-gray-300 dark:border-gray-600 checked:bg-primary-green checked:border-primary-green transition-all cursor-pointer relative after:content-[''] after:hidden after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-white after:font-bold after:text-[14px]";
                
                // Add Checkmark Icon manually via background image or internal SVG wouldn't work easily on input without pseudo-elements
                // Tailwind input custom styling:
                checkbox.style.backgroundImage = `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`;
                checkbox.style.backgroundRepeat = 'no-repeat';
                checkbox.style.backgroundPosition = 'center';
                checkbox.style.backgroundSize = '0'; // Hidden by default
                
                // Toggle Logic
                checkbox.addEventListener('change', () => {
                    if(checkbox.checked) {
                        card.classList.add('ring-2', 'ring-primary-green', 'bg-primary-green/5');
                        card.classList.remove('bg-surface-light', 'dark:bg-white/5'); 
                        checkbox.style.backgroundSize = '100%';
                    } else {
                        card.classList.remove('ring-2', 'ring-primary-green', 'bg-primary-green/5');
                        card.classList.add('bg-surface-light', 'dark:bg-white/5');
                        checkbox.style.backgroundSize = '0';
                    }
                    updateCount();
                });
                
                // Allow card click to toggle
                card.addEventListener('click', (e) => {
                    if(e.target !== checkbox) {
                         checkbox.checked = !checkbox.checked;
                         checkbox.dispatchEvent(new Event('change'));
                    }
                });
                
                checkboxContainer.appendChild(checkbox);
                
                // Insert at the VERY START of the header row
                headerRow.insertBefore(checkboxContainer, headerRow.firstChild);
            }
            
            container.appendChild(card);
        });
    }

    // --- Desktop Discounter Logic ---
    const deskStepTerms = document.getElementById('desktop-discounter-step-terms');
    const deskStepLoading = document.getElementById('desktop-discounter-step-loading');
    const deskStepList = document.getElementById('desktop-discounter-step-list');
    const deskBtnAcceptTerms = document.getElementById('desktop-btn-accept-terms');
    const deskActionArea = document.getElementById('desktop-discounter-action-area');
    const btnOpenDeskDiscounter = document.getElementById('btn-open-desktop-discounter');
    const btnBackToDashboard = document.getElementById('btn-back-to-dashboard');

    if (btnOpenDeskDiscounter) {
        btnOpenDeskDiscounter.addEventListener('click', () => {
             // Reset state just in case
             if(deskStepTerms) deskStepTerms.classList.remove('hidden');
             if(deskStepLoading) deskStepLoading.classList.add('hidden');
             if(deskStepList) deskStepList.classList.add('hidden');
             if(deskActionArea) deskActionArea.classList.add('hidden');
             
             switchDesktopView('desktop-view-discounter');
             // Deselect Main Nav since we are in a sub-view of dashboard conceptually, or keep Dashboard active?
             // Let's keep Dashboard active as strict context
        });
    }

    if (btnBackToDashboard) {
        btnBackToDashboard.addEventListener('click', () => {
             switchDesktopView('desktop-view-dashboard');
        });
    }

    if (deskBtnAcceptTerms) {
        deskBtnAcceptTerms.addEventListener('click', () => {
             if(deskStepTerms) deskStepTerms.classList.add('hidden');
             
             if(deskStepLoading) {
                 deskStepLoading.classList.remove('hidden');
                 deskStepLoading.classList.add('flex');
             }

             setTimeout(() => {
                 if(deskStepLoading) {
                     deskStepLoading.classList.add('hidden');
                     deskStepLoading.classList.remove('flex');
                 }
                 if(deskStepList) deskStepList.classList.remove('hidden');
                 if(deskActionArea) deskActionArea.classList.remove('hidden');
                 
                 renderDesktopDiscounterList();
             }, 1500); 
        });
    }

    function renderDesktopDiscounterList() {
        const container = document.getElementById('desktop-discounter-list-container');
        const sourceList = document.getElementById('desktop-active-subs-grid');
        const countBadge = document.getElementById('desktop-discounter-count-badge');
        
        if (!container || !sourceList) return;
        
        container.innerHTML = '';
        const sourceCards = Array.from(sourceList.children);
        
        const updateCount = () => {
             const checked = container.querySelectorAll('input[type="checkbox"]:checked').length;
             if(countBadge) {
                 countBadge.textContent = checked;
                 if(checked > 0) countBadge.classList.remove('hidden');
                 else countBadge.classList.add('hidden');
             }
        };

        sourceCards.forEach(sourceCard => {
            const card = sourceCard.cloneNode(true);
            card.removeAttribute('onclick');
            card.classList.remove('cursor-pointer', 'active:scale-[0.98]', 'hover:shadow-md');
            
            // Find Header: div.flex.items-center.mb-3
            const headerRow = card.querySelector('div.flex.items-center.mb-3');
            
            if (headerRow) {
                const checkboxContainer = document.createElement('div');
                checkboxContainer.className = "mr-4 flex items-center";
                
                const checkbox = document.createElement('input');
                checkbox.type = "checkbox";
                checkbox.className = "appearance-none size-6 rounded-full border-2 border-gray-300 dark:border-gray-600 checked:bg-primary-green checked:border-primary-green transition-all cursor-pointer";
                checkbox.style.backgroundImage = `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`;
                checkbox.style.backgroundRepeat = 'no-repeat';
                checkbox.style.backgroundPosition = 'center';
                checkbox.style.backgroundSize = '0'; 

                checkbox.addEventListener('change', () => {
                    if(checkbox.checked) {
                        card.classList.add('ring-2', 'ring-primary-green', 'bg-primary-green/5');
                        card.classList.remove('bg-white', 'dark:bg-gray-800'); 
                        checkbox.style.backgroundSize = '100%';
                    } else {
                        card.classList.remove('ring-2', 'ring-primary-green', 'bg-primary-green/5');
                        card.classList.add('bg-white', 'dark:bg-gray-800');
                        checkbox.style.backgroundSize = '0';
                    }
                    updateCount();
                });
                
                card.addEventListener('click', (e) => {
                    if(e.target !== checkbox) {
                         checkbox.checked = !checkbox.checked;
                         checkbox.dispatchEvent(new Event('change'));
                    }
                });
                
                checkboxContainer.appendChild(checkbox);
                headerRow.insertBefore(checkboxContainer, headerRow.firstChild);
            }
            container.appendChild(card);
        });
    }

    // --- FAST RECAP LOGIC ---
    // btnOpenFastRecap is defined at top
    const viewRecapOverlay = document.getElementById('view-recap-overlay');
    const btnCloseRecap = document.getElementById('btn-close-recap');
    const recapSlides = document.querySelectorAll('.recap-slide');
    const recapProgressBars = [
        document.getElementById('recap-progress-1'),
        document.getElementById('recap-progress-2'),
        document.getElementById('recap-progress-3'),
        document.getElementById('recap-progress-4')
    ];
    const recapPrev = document.getElementById('recap-prev');
    const recapNext = document.getElementById('recap-next');
    const btnRecapAction = document.getElementById('btn-recap-action');
    const slide1 = document.getElementById('slide-1');
    const slide1Date = document.getElementById('slide-1-date');

    const brandColors = [
        'bg-blue-600', // BMO
        'bg-red-600', // CIBC / Scotia
        'bg-blue-700', // RBC
        'bg-green-600' // TD
    ];
    let selectedBrandColor = 'bg-blue-600'; // Default

    let currentRecapIndex = 0;
    let recapTimer;
    const SLIDE_DURATION = 4500; // Increased to allow reading

    function openRecap() {
        if (!viewRecapOverlay) return;
        viewRecapOverlay.classList.remove('hidden');
        
        // --- 1. Reset State Before Animation ---
        currentRecapIndex = 0;
        
        // Reset all slides to hidden state immediately
        recapSlides.forEach((slide, i) => {
             // Reset Animatable Elements
             const anims = slide.querySelectorAll('.recap-anim');
             anims.forEach(el => {
                 el.classList.remove('animate-slide-in', 'animate-fade-up');
                 el.style.opacity = '0';
             });

             // Reset Bars
             const bars = slide.querySelectorAll('.usage-bar');
             bars.forEach(bar => bar.style.width = '0');

             if (i === 0) {
                 slide.classList.remove('opacity-0', 'pointer-events-none');
                 slide.classList.add('opacity-100');
             } else {
                 slide.classList.add('opacity-0', 'pointer-events-none');
                 slide.classList.remove('opacity-100');
             }
        });
        
        // Reset Progress Bars
        recapProgressBars.forEach(bar => {
             bar.style.width = '0%';
             bar.style.transition = 'none';
        });

        // --- 2. Dynamic Data & Branding ---
        if(slide1Date) {
            const now = new Date();
            const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
            const year = now.getFullYear();
            const month = monthNames[now.getMonth()];
            slide1Date.textContent = `${month} ${year} RECAP`;
        }

        // Set Bank Logo
        const recapBankLogo = document.getElementById('recap-bank-logo');
        const recapIntroText = document.getElementById('recap-intro-text');
        
        // Ensure bank is valid, default to bmo if not set (though it should be)
        const currentBank = (typeof bank !== 'undefined' && bank) ? bank : 'bmo';
        
        if (brands && brands[currentBank]) {
             if (recapBankLogo) {
                 recapBankLogo.src = brands[currentBank].logo;
                 recapBankLogo.onerror = () => {
                     // Fallback if SVG fails to load
                     recapBankLogo.style.display = 'none';
                 };
                 recapBankLogo.style.display = 'block';
             }
             if (recapIntroText) {
                 const logoName = brands[currentBank].logo || '';
                 const bankNameDisplay = logoName.includes('BMO') ? 'BMO' : 
                                      logoName.includes('CIBC') ? 'CIBC' :
                                      logoName.includes('rbc') ? 'RBC' :
                                      logoName.includes('Scotia') ? 'Scotiabank' :
                                      logoName.includes('Toronto') ? 'TD' : 'Bank';
                 recapIntroText.textContent = `${bankNameDisplay} x MySub Present`.toUpperCase();
             }
        }

        // --- 3. Start Animation ---
        viewRecapOverlay.style.opacity = '0';
        requestAnimationFrame(() => {
            viewRecapOverlay.style.opacity = '1';
            // slight delay to allow opacity transition to start before logic kicks in
            setTimeout(() => {
                showRecapSlide(0);
            }, 50);
        });
    }

    function closeRecap() {
        if (!viewRecapOverlay) return;
        viewRecapOverlay.classList.add('hidden');
        clearTimeout(recapTimer);
        // Reset progress bars
        recapProgressBars.forEach(bar => {
             bar.style.width = '0%';
             bar.style.transition = 'none';
        });
        
        // Reset Slide 1 Color
        if(slide1) {
            slide1.classList.remove('bg-blue-600', 'bg-red-600', 'bg-green-600', 'bg-blue-700'); 
            slide1.classList.add('bg-white');
             // Also reset text colors (simplified via class removal in slide specific logic)
        }
    }

    function showRecapSlide(index) {
        if (index < 0) { index = 0; }
        if (index >= recapSlides.length) {
            closeRecap(); // Finish story
            return;
        }

        currentRecapIndex = index;
        clearTimeout(recapTimer);

        // Hide Next button on last slide
        if(recapNext) {
            if(index === recapSlides.length - 1) {
                recapNext.classList.add('hidden');
                recapNext.classList.remove('flex');
            } else {
                recapNext.classList.remove('hidden');
                recapNext.classList.add('flex');
            }
        }

        // Update Slides
        recapSlides.forEach((slide, i) => {
            // Remove previous animation classes
            const animatedElements = slide.querySelectorAll('.recap-anim');
            animatedElements.forEach(el => {
                 el.classList.remove('animate-slide-in', 'animate-fade-up');
                 el.style.opacity = '0';
            });
            
            // Reset Bars
             const bars = slide.querySelectorAll('.usage-bar');
             bars.forEach(bar => bar.style.width = '0');


            if (i === index) {
                slide.classList.remove('opacity-0', 'pointer-events-none');
                slide.classList.add('opacity-100');
                
                // --- SLIDE SPECIFIC LOGIC ---
                
                // SLIDE 1: Intro Color Reveal
                if (i === 0 && slide1) {
                    // Start White -> Wait 500ms -> Fade to Brand Color
                    
                    // Reset to initial white state first
                    slide1.style.backgroundColor = ''; // clear inline style
                    slide1.classList.remove(...slide1.classList); // create clean slate if possible or just remove known colors
                    slide1.classList.add('recap-slide', 'absolute', 'inset-0', 'flex', 'flex-col', 'items-center', 'justify-center', 'p-12', 'text-center', 'bg-white', 'transition-colors', 'duration-[1500ms]', 'opacity-100', 'ease-in-out', 'group');
                    
                    const content = slide1.querySelector('.recap-content');
                    if(content) content.classList.remove('opacity-0');

                    // Reset Text Colors to Light Mode initially
                    const h1 = slide1.querySelector('h1');
                    const h2 = slide1.querySelector('#recap-intro-text');
                    const dateText = document.getElementById('slide-1-date');
                    const mysubLogo = document.getElementById('recap-mysub-logo');
                    const decorBlobs = slide1.querySelectorAll('.rounded-full.mix-blend-multiply');
                    
                    if(h1) { h1.classList.remove('text-white'); h1.classList.add('text-gray-900'); }
                    if(h2) { h2.classList.remove('text-blue-200', 'text-white/80'); h2.classList.add('text-gray-500'); }
                    if(dateText) { dateText.classList.remove('text-blue-900', 'text-white/90'); dateText.classList.add('text-gray-500'); }
                    if(mysubLogo) { mysubLogo.style.filter = ''; } // Reset filter
                    
                    // Reset blobs opacity
                    decorBlobs.forEach(blob => blob.style.opacity = '0.5');

                    setTimeout(() => {
                        // Apply Brand Color dynamically
                        const brandColorVal = (brands && brands[bank]) ? brands[bank].color : '#2563eb'; // Default Blue
                        
                        slide1.classList.remove('bg-white');
                        slide1.style.backgroundColor = brandColorVal;

                         // Switch Text Colors to Dark Mode (Brand Theme)
                        if(h1) {
                            h1.classList.remove('text-gray-900');
                            h1.classList.add('text-white');
                        }
                        if(h2) {
                            h2.classList.remove('text-gray-500');
                            h2.classList.add('text-white/80'); 
                        }
                        if(dateText) {
                            dateText.classList.remove('text-gray-500');
                            dateText.classList.add('text-white/90'); 
                        }
                        
                        // Invert MySub Logo to White
                        if(mysubLogo) {
                             mysubLogo.style.filter = 'brightness(0) invert(1)';
                        }
                        
                        // Fade out decorative blobs as they might clash
                        decorBlobs.forEach(blob => blob.style.opacity = '0.1');

                    }, 500);
                } else {
                    // Reset Slide 1 if we go back (or are initializing other slides)
                    if(slide1) {
                        slide1.style.backgroundColor = ''; // Remove inline brand color
                        slide1.classList.add('bg-white');
                        
                        const h1 = slide1.querySelector('h1');
                        const h2 = slide1.querySelector('#recap-intro-text');
                        const dateText = document.getElementById('slide-1-date');
                        const mysubLogo = document.getElementById('recap-mysub-logo');
                        const decorBlobs = slide1.querySelectorAll('.rounded-full.mix-blend-multiply');

                        if(h1) { h1.classList.add('text-gray-900'); h1.classList.remove('text-white'); }
                        if(h2) { h2.classList.add('text-gray-500'); h2.classList.remove('text-white/80'); }
                        if(dateText) { dateText.classList.add('text-gray-500'); dateText.classList.remove('text-white/90'); } 
                        if(mysubLogo) { mysubLogo.style.filter = ''; }
                        decorBlobs.forEach(blob => blob.style.opacity = '0.5'); 
                    }
                }

                // SLIDE 4: Summary Color (Dynamic Bank Color)
                if (i === 3) {
                     const brandColorVal = (brands && brands[bank]) ? brands[bank].color : '#111827'; // Default gray-900
                     slide.style.backgroundColor = brandColorVal;
                } else {
                    // Reset if needed, but usually slides are distinct elements
                    if (i === 3) slide.style.backgroundColor = ''; 
                }

                // SLIDE 2 & 3 & 4: Trigger Content Animations
                 setTimeout(() => {
                    const animatedElements = slide.querySelectorAll('.recap-anim');
                    animatedElements.forEach((el, idx) => {
                         // Stagger logic handled by CSS delay, just add the trigger class
                         el.classList.add('animate-slide-in');
                    });
                     
                    // Animate Bars (Slide 2)
                    if (index === 1) {
                        const bars = slide.querySelectorAll('.usage-bar');
                        bars.forEach((bar) => {
                             const targetWidth = bar.dataset.width;
                             // slight delay to let slide appear
                             setTimeout(() => { bar.style.width = targetWidth; }, 300);
                        });
                    }
                 }, 100);

            } else {
                slide.classList.add('opacity-0', 'pointer-events-none');
                slide.classList.remove('opacity-100');
            }
        });

        // Update Progress Bars
        recapProgressBars.forEach((bar, i) => {
            bar.style.transition = 'none'; // reset
            if (i < index) {
                bar.style.width = '100%';
            } else if (i === index) {
                bar.style.width = '0%';
                // Force reflow
                void bar.offsetWidth;
                bar.style.transition = `width ${SLIDE_DURATION}ms linear`;
                bar.style.width = '100%';
            } else {
                bar.style.width = '0%';
            }
        });

        // Auto Advance
        // Don't auto-advance if it's the last slide (index 3)
        if (index === 3) {
             // Stop progress bar or keep it full? 
             // Logic above sets it to full over SLIDE_DURATION
             // We can just not set the timeout for next slide
             return; 
        }

        recapTimer = setTimeout(() => {
            showRecapSlide(currentRecapIndex + 1);
        }, SLIDE_DURATION);
    }

    if (btnOpenFastRecap) {
        btnOpenFastRecap.addEventListener('click', openRecap);
    }
    if (btnOpenFastRecapAnalytics) {
        btnOpenFastRecapAnalytics.addEventListener('click', openRecap);
    }
    if (btnCloseRecap) {
        btnCloseRecap.addEventListener('click', closeRecap);
    }
    if (recapPrev) {
        recapPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            showRecapSlide(currentRecapIndex - 1);
        });
    }
    if (recapNext) {
        recapNext.addEventListener('click', (e) => {
            e.stopPropagation();
            showRecapSlide(currentRecapIndex + 1);
        });
    }
    // Action button inside recap
    if (btnRecapAction) {
        btnRecapAction.addEventListener('click', (e) => {
             e.stopPropagation();
             closeRecap(); 
             // Could trigger credit view or similar here
        });
    }

}); // End DOMContentLoaded
