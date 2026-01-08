document.addEventListener('DOMContentLoaded', () => {
    // Refs
    const viewLogin = document.getElementById('view-login');
    const mainApp = document.getElementById('main-app');
    const viewDashboard = document.getElementById('view-dashboard');
    const viewHeatmap = document.getElementById('view-heatmap');
    const viewCredit = document.getElementById('view-credit');
    const viewDiscounter = document.getElementById('view-discounter');
    const bottomNav = document.getElementById('bottom-nav');
    
    // Buttons
    const btnLoginBank = document.getElementById('btn-login-bank');
    const bankSelect = document.getElementById('bank-select'); // Bank Select Ref
    const bankLogoDisplay = document.getElementById('bank-logo-display'); // New Logo Container
    const btnLoginEmail = document.getElementById('btn-login-email');
    const btnBackDashboard = document.querySelectorAll('.btn-back-dashboard');
    const btnOpenDiscounter = document.getElementById('btn-open-discounter');
    const btnBackCredit = document.querySelector('.btn-back-credit');
    const navItems = document.querySelectorAll('.nav-item');

    // --- Desktop Navigation Refs ---
    const desktopNavDashboard = document.getElementById('desktop-nav-dashboard');
    const desktopNavAnalytics = document.getElementById('desktop-nav-analytics');
    const desktopNavCredit = document.getElementById('desktop-nav-credit');
    
    const desktopViewDashboard = document.getElementById('desktop-view-dashboard');
    const desktopViewHeatmap = document.getElementById('desktop-view-heatmap');
    const desktopViewCredit = document.getElementById('desktop-view-credit');

    // Desktop Filters Refs
    const btnDesktopAll = document.getElementById('btn-desktop-all');
    const btnDesktopDate = document.getElementById('btn-desktop-date');
    const btnDesktopPrice = document.getElementById('btn-desktop-price');
    const desktopSubsGrid = document.getElementById('desktop-subs-grid');

    // Init
    let currentView = 'login';
    let currentTab = 'dashboard';

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

        // Hide all views inside main-app
        viewDashboard.classList.add('hidden');
        viewHeatmap.classList.add('hidden');
        if(viewCredit) viewCredit.classList.add('hidden');
        if(viewDiscounter) viewDiscounter.classList.add('hidden');

        // Reset Nav
        resetNavStyles();

        // Show specific view
        if (tabName === 'dashboard') {
            viewDashboard.classList.remove('hidden');
            setActiveNav(0); // Home index
        } else if (tabName === 'heatmap') {
            viewHeatmap.classList.remove('hidden');
            setActiveNav(2); // Analytics index (Moved to position 3, index 2)
        } else if (tabName === 'credit') {
             if(viewCredit) viewCredit.classList.remove('hidden');
             setActiveNav(1); // Credit index (Moved to position 2, index 1)
        } else if (tabName === 'profile') {
             // Placeholder
             viewDashboard.classList.remove('hidden');
             setActiveNav(3);
        }
    }

    function resetNavStyles() {
        navItems.forEach(item => {
            const iconContainer = item.querySelector('.icon-container');
            const icon = item.querySelector('.material-symbols-outlined');
            const label = item.querySelector('.label');

            // Reset classes to inactive state (gray)
            iconContainer.classList.remove('bg-primary-green/10');
            iconContainer.classList.add('bg-transparent');
            
            icon.classList.remove('text-primary-green', 'filled');
            icon.classList.add('text-gray-400');
            
            label.classList.remove('text-primary-green', 'font-bold');
            label.classList.add('text-gray-400', 'font-medium');
        });
    }

    function setActiveNav(index) {
        if (!navItems[index]) return;
        const item = navItems[index];

        const iconContainer = item.querySelector('.icon-container');
        const icon = item.querySelector('.material-symbols-outlined');
        const label = item.querySelector('.label');

        // Set Active Styles
        iconContainer.classList.remove('bg-transparent');
        iconContainer.classList.add('bg-primary-green/10');

        icon.classList.remove('text-gray-400');
        icon.classList.add('text-primary-green', 'filled');

        label.classList.remove('text-gray-400', 'font-medium');
        label.classList.add('text-primary-green', 'font-bold');
    }

    // Event Listeners
    if (bankSelect) {
        bankSelect.addEventListener('change', (e) => {
            const bank = e.target.value;
            const btn = btnLoginBank;
            
            // Allow Logic - Button becomes standardized gray/black
            btn.disabled = false;
            btn.classList.remove('bg-gray-200', 'dark:bg-white/5', 'text-gray-400', 'dark:text-gray-500', 'cursor-not-allowed', 'shadow-none');
            // Add active styles (Base styles)
            btn.classList.add('text-white', 'shadow-lg', 'active:scale-[0.98]', 'cursor-pointer');
            
            // Clear any inline styles
            btn.style.backgroundColor = '';
            btn.style.boxShadow = '';
            btn.style.filter = '';
            btn.onmouseenter = null;
            btn.onmouseleave = null;

            // Define Brand Colors & Logos
            const brands = {
                bmo: { color: '#0079C1', logo: 'BMO_Logo.svg', guarantee: 'BMO Digital Banking Security Guarantee' },
                cibc: { color: '#C41F3E', logo: 'CIBC_logo_2021.svg', guarantee: 'CIBC Digital Banking Guarantee' },
                rbc: { color: '#005DAA', logo: 'rbc-4-logo-svg-vector.svg', guarantee: 'RBC Digital Banking Security Guarantee' },
                scotia: { color: '#EC111A', logo: 'Scotiabank_logo.svg', guarantee: 'Digital Banking Security Guarantee' },
                td: { color: '#00853F', logo: 'Toronto-Dominion_Bank_logo.svg', guarantee: 'TD Online and Mobile Security Guarantee' }
            };

            const brandData = brands[bank];
            
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

            // Base Style Reset for consistency in JS logic if needed
            if(btnDesktopAll) btnDesktopAll.style.backgroundColor = '';
            
            if (brandData) {
                // Update Global Theme
                const rgbChannels = hexToRgbChannels(brandData.color);
                document.documentElement.style.setProperty('--color-primary', rgbChannels);
                document.documentElement.style.setProperty('--color-primary-green', rgbChannels);
                document.documentElement.style.setProperty('--color-primary-dark', rgbChannels); // Simplified

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
                 btn.classList.remove('text-white', 'shadow-lg', 'active:scale-[0.98]', 'cursor-pointer');
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

    // --- Desktop Navigation Logic ---


    if (btnDesktopAll && btnDesktopDate && btnDesktopPrice && desktopSubsGrid) {
        
        const resetDesktopFilterStyles = () => {
             // Reset all buttons to inactive default look
             [btnDesktopAll, btnDesktopDate, btnDesktopPrice].forEach(btn => {
                 btn.classList.remove('bg-primary-green', 'text-white', 'shadow-sm', 'shadow-primary-green/20');
                 btn.classList.add('bg-white', 'dark:bg-white/5', 'text-text-main', 'dark:text-white');
                 const icon = btn.querySelector('.material-symbols-outlined');
                 if(icon) {
                     icon.classList.remove('text-white');
                     icon.classList.add('text-gray-500');
                 }
                 const text = btn.querySelector('span:last-child'); // span font-medium ...
                 // We need to ensure we re-add border if it was removed? 
                 // Actually our active style just changes bg. 
                 // Let's rely on class swapping.
                 btn.classList.add('border', 'border-gray-200', 'dark:border-white/10');
             });
        };

        const setActiveFilterStyle = (activeBtn) => {
            resetDesktopFilterStyles();
            // Apply Active
            activeBtn.classList.remove('bg-white', 'dark:bg-white/5', 'text-text-main', 'dark:text-white', 'border', 'border-gray-200', 'dark:border-white/10');
            // If primary-green variable is not set (default), these classes work.
            // If it IS set (bank login), we need to ensure 'bg-primary-green' maps to the variable, which tailwind config does.
            activeBtn.classList.add('bg-primary-green', 'text-white', 'shadow-sm', 'shadow-primary-green/20');
            
            const icon = activeBtn.querySelector('.material-symbols-outlined');
            if(icon) {
                icon.classList.remove('text-gray-500');
                icon.classList.add('text-white');
            }
        };

        const getSubs = () => Array.from(desktopSubsGrid.children);

        // Sort By Date (Assuming order in DOM is date, or simpler logic for demo)
        // For distinct date sorting, we'd need data attributes. Let's assume standard DOM order is "Date".
        // Or we can add simple random shuffle for visual effect if no real dates.
        // Let's use Price for Price sort since we have data-price.
        
        btnDesktopAll.addEventListener('click', () => {
            setActiveFilterStyle(btnDesktopAll);
            // Default "All" - maybe restore initial order or just show all
            // For now, let's just sort by DOM order (which we can't easily recover unless saved, so let's just leave it)
            // Or reload? 
            // Let's implement a simple "Reset" order if we had indices.
            // For this UI demo, we will just set the active state.
        });

        btnDesktopDate.addEventListener('click', () => {
             setActiveFilterStyle(btnDesktopDate);
             // Demo: Shuffle slightly or Sort by Name as proxy
             const subs = getSubs();
             subs.sort((a, b) => {
                 const nameA = a.dataset.name || "";
                 const nameB = b.dataset.name || "";
                 return nameA.localeCompare(nameB);
             });
             subs.forEach(sub => desktopSubsGrid.appendChild(sub));
        });

        btnDesktopPrice.addEventListener('click', () => {
            setActiveFilterStyle(btnDesktopPrice);
            const subs = getSubs();
            subs.sort((a,b) => {
                const priceA = parseFloat((a.dataset.price || "0").replace(/[^0-9.]/g, ''));
                const priceB = parseFloat((b.dataset.price || "0").replace(/[^0-9.]/g, ''));
                return priceB - priceA; // Descending
            });
            subs.forEach(sub => desktopSubsGrid.appendChild(sub));
        });
    }

    function updateDesktopNavStyles(active, ...inactives) {
        if (!active) return;
        // Active Style
        active.classList.add('bg-primary-green/10', 'text-primary-green');
        active.classList.remove('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-50', 'dark:hover:bg-white/5');
        const iconA = active.querySelector('.material-symbols-outlined');
        if(iconA) iconA.classList.add('filled');

        // Inactive Styles
        inactives.forEach(inactive => {
            if(!inactive) return;
            inactive.classList.remove('bg-primary-green/10', 'text-primary-green');
            inactive.classList.add('text-gray-600', 'dark:text-gray-400', 'hover:bg-gray-50', 'dark:hover:bg-white/5');
            const iconI = inactive.querySelector('.material-symbols-outlined');
            if(iconI) iconI.classList.remove('filled');
        });
    }

    function switchDesktopView(viewId) {
        // 1. Force Hide All
        if(desktopViewDashboard) {
            desktopViewDashboard.classList.add('hidden');
            desktopViewDashboard.classList.remove('md:flex', 'flex'); 
        }
        if(desktopViewHeatmap) {
            desktopViewHeatmap.classList.add('hidden');
            desktopViewHeatmap.classList.remove('flex');
        }
        if(desktopViewCredit) {
             desktopViewCredit.classList.add('hidden');
             desktopViewCredit.classList.remove('flex');
        }

        // 2. Show Target
        const target = document.getElementById(viewId);
        if(target) {
            target.classList.remove('hidden');
            target.classList.add('flex');
            // Ensure full height/width if needed
            if (viewId === 'desktop-view-dashboard') {
                target.classList.add('md:flex');
            }
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
    // Only init desktop calculator if elements exist (might be removed in some layouts)
    if(deskSelectService && deskSelectCredit && deskFinalPricents exist (might be removed in some layouts)
    if(deskSelectService && deskSelectCredit && deskFinalPrice) {
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
            if(viewCredit) viewCredit.classList.add('hidden');
            if(viewDiscounter) viewDiscounter.classList.remove('hidden');
        });
    }

    if (btnBackCredit) {
        btnBackCredit.addEventListener('click', () => {
             if(viewDiscounter) viewDiscounter.classList.add('hidden');
             if(viewCredit) viewCredit.classList.remove('hidden');
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

}); // End DOMContentLoaded
