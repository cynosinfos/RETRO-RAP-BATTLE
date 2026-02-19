/**
 * CardGenerator - Dynamic card rendering using HTML Canvas
 * Generates visual card representations based on tier, type, and stats
 */
class CardGenerator {
    constructor() {
        this.cardWidth = 200;
        this.cardHeight = 300;
        this.SVGS = {
            facebook: '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>',
            x: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.134l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
            share: '<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/>',
            instagram: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>',
            kick: '<path d="M5.4 3h2.7v6.3l5.4-6.3h3.6l-6.3 7.2 6.3 9h-3.6l-5.4-7.2v7.2h-2.7z"/>'
        };
    }

    /**
     * Generate a card as Canvas element (async to handle image loading)
     * @param {Object} cardData - Card data from CARDS_DATABASE
     * @returns {Promise<HTMLCanvasElement>}
     */
    async generateCard(cardData) {
        this.currentCardId = cardData.id;
        const canvas = document.createElement('canvas');
        canvas.width = this.cardWidth;
        canvas.height = this.cardHeight;
        canvas.className = 'card-canvas'; // Added class for easier selection during sharing
        const ctx = canvas.getContext('2d');

        const tierConfig = CARD_TIERS[cardData.tier];

        // Background
        this.drawBackground(ctx, tierConfig);

        // Border & Glow
        this.drawBorder(ctx, tierConfig);

        // Header (Tier Badge)
        this.drawHeader(ctx, cardData, tierConfig);

        // Portrait Area (async - wait for image load)
        await this.drawPortrait(ctx, cardData);

        // Name
        this.drawName(ctx, cardData);

        // Type Badge
        this.drawTypeBadge(ctx, cardData);

        // Stats
        this.drawStats(ctx, cardData);

        // Effect Description
        this.drawEffect(ctx, cardData);

        return canvas;
    }

    drawBackground(ctx, tierConfig) {
        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, this.cardHeight);
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.5, '#1a1a1a');
        gradient.addColorStop(1, '#0a0a0a');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.cardWidth, this.cardHeight);
    }

    drawBorder(ctx, tierConfig) {
        // Outer glow
        ctx.shadowColor = tierConfig.glow;
        ctx.shadowBlur = 20;

        // Main border
        const borderGradient = ctx.createLinearGradient(0, 0, 0, this.cardHeight);
        tierConfig.gradient.forEach((color, i) => {
            borderGradient.addColorStop(i / (tierConfig.gradient.length - 1), color);
        });

        ctx.strokeStyle = borderGradient;
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, this.cardWidth - 6, this.cardHeight - 6);

        ctx.shadowBlur = 0;
    }

    drawHeader(ctx, cardData, tierConfig) {
        // Tier badge at top
        ctx.fillStyle = tierConfig.color;
        ctx.font = 'bold 14px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(tierConfig.name, this.cardWidth / 2, 30);
    }

    /**
     * Draw portrait with actual image loading
     * @param {CanvasRenderingContext2D} ctx
     * @param {Object} cardData
     * @returns {Promise<void>}
     */
    async drawPortrait(ctx, cardData) {
        const tierConfig = CARD_TIERS[cardData.tier];
        const portraitY = 50;
        const portraitHeight = 180;
        const portraitWidth = this.cardWidth - 40;

        // Tier-colored gradient background
        const bgGradient = ctx.createLinearGradient(20, portraitY, 20, portraitY + portraitHeight);
        bgGradient.addColorStop(0, tierConfig.gradient[0] + '55'); // Semi-transparent
        bgGradient.addColorStop(0.5, '#222');
        bgGradient.addColorStop(1, tierConfig.gradient[tierConfig.gradient.length - 1] + '55');

        ctx.fillStyle = bgGradient;
        ctx.fillRect(20, portraitY, portraitWidth, portraitHeight);

        // Load and draw actual image if available
        if (cardData.imagePath) {
            try {
                const img = await this.loadImage(cardData.imagePath);

                // Albumy i sklady mają swoje dedykowane obrazy - rysuj cały obraz
                const isFullImage = cardData.imagePath.includes('cards/') || cardData.type === 'PŁYTA' || cardData.type === 'SKŁAD';

                if (isFullImage) {
                    // Pelny obraz (albumy, sklady, placeholdery)
                    ctx.drawImage(img, 20, portraitY, portraitWidth, portraitHeight);
                } else {
                    // Sprite sheet postaci - wycinamy row 0, frame 0
                    let cols = 8; // domyslnie 8x8
                    let rows = 8;

                    // Sprobuj pobrac dane z characterData
                    if (window.characterData) {
                        const imgBase = cardData.imagePath
                            .replace(/.*\//, '')
                            .replace('_8x8.png', '')
                            .replace('_500.png', '');
                        const charKey = imgBase.toUpperCase().replace(/_/g, ' ');
                        const charData = window.characterData[charKey] || window.characterData[imgBase.toUpperCase()];
                        if (charData && charData.spriteSheetData) {
                            cols = charData.spriteSheetData.framesMax || 8;
                            rows = charData.spriteSheetData.rows || 8;
                        }
                    }

                    const frameW = img.naturalWidth / cols;
                    const frameH = img.naturalHeight / rows;

                    ctx.drawImage(
                        img,
                        0, 0,           // source: row 0, frame 0
                        frameW, frameH, // source size: jedna klatka
                        20, portraitY,  // dest x, y
                        portraitWidth, portraitHeight
                    );
                }
            } catch (error) {
                this.drawPlaceholderText(ctx, portraitY, portraitHeight, cardData);
            }
        } else {
            this.drawPlaceholderText(ctx, portraitY, portraitHeight, cardData);
        }

        // Add holographic shimmer effect overlay
        this.drawShimmerEffect(ctx, portraitY, portraitWidth, portraitHeight, tierConfig);
    }

    /**
     * Load image as Promise
     * @param {String} src
     * @returns {Promise<HTMLImageElement>}
     */
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load: ${src}`));
            img.src = src;
        });
    }

    drawShimmerEffect(ctx, portraitY, portraitWidth, portraitHeight, tierConfig) {
        // Create diagonal shimmer gradient (holographic effect)
        const shimmerGradient = ctx.createLinearGradient(20, portraitY, 20 + portraitWidth, portraitY + portraitHeight);
        shimmerGradient.addColorStop(0, 'rgba(255,255,255,0)');
        shimmerGradient.addColorStop(0.3, `${tierConfig.glow}33`); // Tier color with transparency
        shimmerGradient.addColorStop(0.5, 'rgba(255,255,255,0.15)'); // Bright shimmer
        shimmerGradient.addColorStop(0.7, `${tierConfig.glow}33`);
        shimmerGradient.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = shimmerGradient;
        ctx.fillRect(20, portraitY, portraitWidth, portraitHeight);
    }

    drawName(ctx, cardData) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px "Press Start 2P"';
        ctx.textAlign = 'center';

        // Check for custom label override
        let name = cardData.name;
        if (window.CUSTOM_CARD_LABELS && window.CUSTOM_CARD_LABELS[cardData.id]) {
            name = window.CUSTOM_CARD_LABELS[cardData.id];
        }

        // Wrap long names
        if (name.length > 18) {
            const words = name.split(' ');
            const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
            const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
            ctx.fillText(line1, this.cardWidth / 2, 250);
            ctx.fillText(line2, this.cardWidth / 2, 268);
        } else {
            ctx.fillText(name, this.cardWidth / 2, 250);
        }
    }

    /**
     * Draw stylized placeholder when image is missing
     */
    drawPlaceholderText(ctx, portraitY, portraitHeight, cardData) {
        const portraitWidth = this.cardWidth - 40;
        const centerX = this.cardWidth / 2;
        const centerY = portraitY + portraitHeight / 2;
        const tierColor = CARD_TIERS[cardData.tier].color;

        // 1. Background Fill based on Tier
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(20, portraitY, portraitWidth, portraitHeight);

        // 2. Subtle background texture/pattern (Circuit/Vinyl influence)
        ctx.strokeStyle = `${tierColor}33`; // 20% opacity of tier color
        ctx.lineWidth = 1;

        if (cardData.type === 'PŁYTA') {
            // Vinyl rings pattern
            for (let i = 0; i < 8; i++) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, 20 + i * 15, 0, Math.PI * 2);
                ctx.stroke();
            }
        } else {
            // Grid pattern for others
            for (let i = 0; i < 10; i++) {
                ctx.beginPath();
                ctx.moveTo(20 + i * 20, portraitY);
                ctx.lineTo(20 + i * 20, portraitY + portraitHeight);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(20, portraitY + i * 20);
                ctx.lineTo(20 + portraitWidth, portraitY + i * 20);
                ctx.stroke();
            }
        }

        // 3. Display name with premium typography
        let displayText = "NO IMAGE";
        if (window.CUSTOM_CARD_LABELS && window.CUSTOM_CARD_LABELS[cardData.id]) {
            displayText = window.CUSTOM_CARD_LABELS[cardData.id];
        }

        ctx.save();
        ctx.shadowColor = tierColor;
        ctx.shadowBlur = 15;

        // Dynamic font sizing based on length
        let fontSize = 14;
        if (displayText.length > 20) fontSize = 10;
        else if (displayText.length > 12) fontSize = 12;

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${fontSize}px "Press Start 2P"`;
        ctx.textAlign = 'center';

        const words = displayText.split(' ');
        if (words.length > 2) {
            // Multi-line for long names
            const midway = Math.ceil(words.length / 2);
            const line1 = words.slice(0, midway).join(' ');
            const line2 = words.slice(midway).join(' ');
            ctx.fillText(line1, centerX, centerY - 10);
            ctx.fillText(line2, centerX, centerY + 15);
        } else if (words.length === 2 && displayText.length > 10) {
            ctx.fillText(words[0], centerX, centerY - 10);
            ctx.fillText(words[1], centerX, centerY + 15);
        } else {
            ctx.fillText(displayText, centerX, centerY);
        }
        ctx.restore();

        // 4. Icon/Watermark at bottom
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.font = '20px "Press Start 2P"';
        const typeIcon = cardData.type === 'PŁYTA' ? '💿' : (cardData.type === 'SKŁAD' ? '👥' : 'RRB');
        ctx.fillText(typeIcon, centerX, portraitY + portraitHeight - 20);
    }

    drawTypeBadge(ctx, cardData) {
        const tierConfig = CARD_TIERS[cardData.tier];

        ctx.fillStyle = tierConfig.color;
        ctx.font = '10px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(cardData.type, this.cardWidth / 2, 285);
    }

    drawStats(ctx, cardData) {
        if (cardData.type === 'RAPER' && cardData.stats) {
            const statsY = 305;
            ctx.font = '8px "Press Start 2P"';
            ctx.textAlign = 'left';
            ctx.fillStyle = '#ffaa00';

            let statText = `PWR:${cardData.stats.power || 0} SPD:${cardData.stats.speed || 0} DEF:${cardData.stats.defense || 0}`;
            ctx.fillText(statText, 20, statsY);
        }
    }

    drawEffect(ctx, cardData) {
        ctx.fillStyle = '#aaaaaa';
        ctx.font = '7px "Press Start 2P"';
        ctx.textAlign = 'center';

        const effectText = cardData.effect || '';
        const words = effectText.split(' ');
        let lines = [];
        let currentLine = '';

        words.forEach(word => {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);
            if (metrics.width > this.cardWidth - 30) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });
        lines.push(currentLine);

        lines.slice(0, 3).forEach((line, i) => {
            ctx.fillText(line, this.cardWidth / 2, 330 + (i * 12));
        });
    }

    /**
     * Generate HTML element containing the card with social tooltip
     * @param {Object} cardData
     * @returns {Promise<HTMLDivElement>}
     */
    async generateCardElement(cardData) {
        const container = document.createElement('div');
        container.className = 'card-container';
        container.style.cssText = 'display: inline-flex; flex-direction: column; align-items: center; margin: 15px; cursor: pointer; transition: transform 0.3s; position: relative;';

        const canvas = await this.generateCard(cardData);
        container.appendChild(canvas);

        // Persistent Social Links Row
        const socialRow = document.createElement('div');
        socialRow.className = 'card-social-links';
        socialRow.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-top: 10px;
            padding: 8px;
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid #333;
            border-radius: 4px;
            width: 100%;
            transition: all 0.3s;
        `;

        const createIconLink = (href, svgPath, color, label) => {
            const link = document.createElement('a');
            link.href = href;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="${color}">${svgPath}</svg>`;
            link.title = label;
            link.style.cssText = `
                text-decoration: none;
                transition: transform 0.2s, filter 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            link.onmouseenter = () => {
                link.style.transform = 'scale(1.3)';
                link.style.filter = `drop-shadow(0 0 8px ${color})`;
            };
            link.onmouseleave = () => {
                link.style.transform = 'scale(1)';
                link.style.filter = 'none';
            };
            link.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault(); // zapobiegaj domyslnej nawigacji (blokowanej przez game)
                window.open(href, '_blank', 'noopener,noreferrer'); // otworz bezposrednio
                if (window.achievementManager) window.achievementManager.trackEvent('social_link_clicked', { type: label.toLowerCase() });
            };
            return link;
        };

        const SVGS = {
            spotify: '<path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.502 17.31c-.22.36-.677.472-1.037.252-2.822-1.725-6.375-2.112-10.556-1.16-.41.094-.82-.163-.915-.572-.095-.41.162-.82.572-.915 4.568-1.043 8.49-.6 11.645 1.332.36.22.472.677.252 1.037l.039.026zm1.47-3.26c-.276.45-.86.59-1.31.314-3.23-1.985-8.156-2.564-11.975-1.405-.506.153-1.04-.132-1.194-.638-.154-.506.132-1.04.638-1.194 4.368-1.326 9.79-.675 13.526 1.62.45.277.59.86.314 1.31l.001-.007zm.126-3.41c-3.873-2.3-10.274-2.515-14.004-1.382-.594.18-1.223-.153-1.403-.747-.18-.594.153-1.223.747-1.403 4.28-1.3 11.335-1.047 15.79 1.597.533.317.71.996.393 1.53-.317.533-.996.71-1.53.393l.007.008z"/>',
            instagram: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>',
            youtube: '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>',
            kick: '<path d="M5.4 3h2.7v6.3l5.4-6.3h3.6l-6.3 7.2 6.3 9h-3.6l-5.4-7.2v7.2h-2.7z"/>',
            share: '<path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>'
        };

        let hasLinks = false;
        if (cardData.social) {
            if (cardData.social.spotify) {
                socialRow.appendChild(createIconLink(cardData.social.spotify, SVGS.spotify, '#1DB954', 'Spotify'));
                hasLinks = true;
            }
            if (cardData.social.instagram) {
                socialRow.appendChild(createIconLink(cardData.social.instagram, SVGS.instagram, '#E1306C', 'Instagram'));
                hasLinks = true;
            }
            if (cardData.social.youtube) {
                socialRow.appendChild(createIconLink(cardData.social.youtube, SVGS.youtube, '#FF0000', 'YouTube'));
                hasLinks = true;
            }
            if (cardData.social.kick) {
                socialRow.appendChild(createIconLink(cardData.social.kick, SVGS.kick, '#53fc18', 'Kick'));
                hasLinks = true;
            }
        }

        // Share Button (always present)
        const shareBtn = document.createElement('div');
        shareBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="#00ffff">${SVGS.share}</svg>`;
        shareBtn.title = 'Udostępnij Obraz Karty';
        shareBtn.style.cssText = `
            cursor: pointer;
            transition: transform 0.2s, filter 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        shareBtn.onmouseenter = () => {
            shareBtn.style.transform = 'scale(1.3)';
            shareBtn.style.filter = 'drop-shadow(0 0 8px #00ffff)';
        };
        shareBtn.onmouseleave = () => {
            shareBtn.style.transform = 'scale(1)';
            shareBtn.style.filter = 'none';
        };
        shareBtn.onclick = (e) => {
            e.stopPropagation();
            this.showShareModal(cardData);
        };
        socialRow.appendChild(shareBtn);

        if (!hasLinks) {
            const placeholder = document.createElement('span');
            placeholder.textContent = 'LINKI...';
            placeholder.style.cssText = 'color: #444; font-family: "Press Start 2P"; font-size: 6px; align-self: center;';
            socialRow.insertBefore(placeholder, shareBtn);
        }

        container.appendChild(socialRow);

        // Hover effects for the WHOLE container
        container.addEventListener('mouseenter', () => {
            container.style.transform = 'scale(1.1) translateY(-10px)';
            container.style.zIndex = '999';
            canvas.style.filter = 'brightness(1.2) drop-shadow(0 0 30px rgba(0, 255, 255, 0.4))';
            socialRow.style.background = 'rgba(0, 0, 0, 0.95)';
            socialRow.style.borderColor = '#00ffff';
            socialRow.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.3)';
        });

        container.addEventListener('mouseleave', () => {
            container.style.transform = 'scale(1) translateY(0)';
            container.style.zIndex = '1';
            canvas.style.filter = 'none';
            socialRow.style.background = 'rgba(0, 0, 0, 0.8)';
            socialRow.style.borderColor = '#333';
            socialRow.style.boxShadow = 'none';
        });

        return container;
    }

    async showShareModal(data, type = 'card') {
        if (window.achievementManager) window.achievementManager.trackEvent('shared_count');

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const title = type === 'card' ? `Karta: ${data.name}` : "Mój Drop w RRB!";
        const text = type === 'card' ?
            `TRAFIŁEM ${data.tier.toUpperCase()}: ${data.name.toUpperCase()}! 🔥` :
            data.text || "Sprawdź mój drop w Retro Rap Battle! 🎤🔥";
        const url = window.location.origin + window.location.pathname;

        // Remove existing modal if any
        const existing = document.getElementById('shareModal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'shareModal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
            font-family: 'Inter', sans-serif; color: white;
            animation: fadeIn 0.3s ease;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: #1a1a1a; padding: 30px; border-radius: 20px;
            border: 2px solid #ff0055; width: 90%; max-width: 400px;
            text-align: center; box-shadow: 0 0 30px rgba(255,0,85,0.3);
        `;

        content.innerHTML = `
            <h2 style="margin-top:0; color:#ff0055; text-transform:uppercase; letter-spacing:2px;">UDOSTĘPNIJ DROP!</h2>
            <p style="font-size: 14px; color: #aaa; margin-bottom: 25px;">${text}</p>
            <div id="shareGrid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 25px;"></div>
            <div id="imageShareBlock" style="margin-bottom: 20px; display: none;">
                <button id="shareImgBtn" style="width:100%; padding:12px; background:#ff0055; color:white; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">
                    📸 UDOSTĘPNIJ JAKO OBRAZ (.PNG)
                </button>
            </div>
            <button id="copyBtn" style="width:100%; padding:10px; background:#333; color:white; border:none; border-radius:10px; font-size:12px; cursor:pointer;">
                🔗 KOPIUJ LINK
            </button>
            <button id="closeModal" style="margin-top: 15px; background:none; border:none; color:#666; cursor:pointer; font-size:12px; text-decoration:underline;">zamknij</button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        const grid = content.querySelector('#shareGrid');
        const platforms = [
            { name: 'Facebook', color: '#1877F2', icon: this.SVGS.facebook || '<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
            { name: 'X', color: '#000000', icon: this.SVGS.x || '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.134l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}` },
            { name: 'WhatsApp', color: '#25D366', icon: '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.415-8.412z"/>', url: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}` },
            { name: 'Instagram', color: '#E1306C', icon: this.SVGS.instagram || '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>', url: `https://www.instagram.com/` }
        ];

        platforms.forEach(p => {
            const btn = document.createElement('div');
            btn.style.cssText = `
                display: flex; flex-direction: column; align-items: center; cursor: pointer;
                transition: transform 0.2s ease;
            `;
            btn.innerHTML = `
                <div style="width:50px; height:50px; background:${p.color}; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-bottom:8px; box-shadow:0 4px 10px rgba(0,0,0,0.3);">
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="white">${p.icon}</svg>
                </div>
                <span style="font-size:10px; color:#888;">${p.name}</span>
            `;
            btn.onclick = () => {
                if (p.name === 'Instagram') {
                    this.handleInstagramFlow(data, type);
                } else {
                    window.open(p.url, '_blank');
                }
            };
            btn.onmouseenter = () => btn.style.transform = 'scale(1.1)';
            btn.onmouseleave = () => btn.style.transform = 'scale(1)';
            grid.appendChild(btn);
        });

        // Add Image Share Button if canvas exists
        const cardCanvas = document.querySelector('.card-canvas');
        if (cardCanvas || type === 'drop') {
            const imgBlock = modal.querySelector('#imageShareBlock');
            imgBlock.style.display = 'block';
            modal.querySelector('#shareImgBtn').onclick = () => this.handleImageShare(data, type);
        }

        modal.querySelector('#copyBtn').onclick = () => {
            navigator.clipboard.writeText(url);
            modal.querySelector('#copyBtn').innerText = '✅ SKOPIOWANO!';
            setTimeout(() => modal.querySelector('#copyBtn').innerText = '🔗 KOPIUJ LINK', 2000);
        };

        modal.querySelector('#closeModal').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }

    async handleInstagramFlow(data, type) {
        // Find Canvas
        const canvas = document.querySelector('.card-canvas') || document.querySelector('canvas');
        if (!canvas) {
            window.open('https://www.instagram.com/', '_blank');
            return;
        }

        // Show feedback
        const btn = document.querySelector('#shareModal h2');
        if (btn) btn.innerText = "PRZYGOTOWYWANIE...";

        try {
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const file = new File([blob], 'rrb_drop.png', { type: 'image/png' });

            // Download as fallback and reminder
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `RRB_${data.name || 'Drop'}.png`;
            link.click();

            alert("OBRAZEK POBRANY! Teraz otwórz Instagram i udostępnij go w swojej Relacji (Story).");
            window.open('https://www.instagram.com/', '_blank');

            if (btn) btn.innerText = "UDOSTĘPNIJ!";
        } catch (e) {
            console.error(e);
            window.open('https://www.instagram.com/', '_blank');
        }
    }

    async handleImageShare(data, type) {
        const canvas = document.querySelector('.card-canvas') || document.querySelector('canvas');
        if (!canvas) return;

        try {
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const file = new File([blob], 'rrb_share.png', { type: 'image/png' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Retro Rap Battle Drop',
                    text: `Mój drop w RRB: ${data.name || ''}!`
                });
            } else {
                // Fallback: Download
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.href = canvas.toDataURL('image/png');
                link.download = 'RRB_Kolekcja.png';
                link.click();
                alert("Obraz Twojej kolekcji został pobrany! Udostępnij go na Instagramie lub Facebooku.");
            }
        } catch (e) {
            console.error("Share failed:", e);
        }
    }

    async shareFullCollection(targetSelector = '.collection-grid') {
        const target = document.querySelector(targetSelector) || document.body;
        if (typeof html2canvas === 'undefined') {
            alert("Błąd: Biblioteka html2canvas nie została załadowana.");
            return;
        }

        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; inset: 0; background: rgba(0,0,0,0.8);
            z-index: 10000; display: flex; align-items: center;
            justify-content: center; color: white; font-family: sans-serif;
        `;
        overlay.innerHTML = '<div style="background:#111; padding:20px; border-radius:10px; border:2px solid #ff0055;">📸 PRZYGOTOWYWANIE ZDJĘCIA KOLEKCJI...</div>';
        document.body.appendChild(overlay);

        try {
            const canvas = await html2canvas(target, {
                useCORS: true,
                backgroundColor: '#0a0a0a',
                scale: 2, // High Quality
                logging: false,
                onclone: (clonedDoc) => {
                    // 1. Fix Canvas elements (html2canvas often renders them blank)
                    const originalCanvases = target.querySelectorAll('canvas');
                    const clonedCanvases = clonedDoc.querySelectorAll('canvas');

                    originalCanvases.forEach((orig, idx) => {
                        const cloned = clonedCanvases[idx];
                        if (cloned) {
                            const img = clonedDoc.createElement('img');
                            img.src = orig.toDataURL('image/png');
                            img.style.cssText = cloned.style.cssText;
                            img.className = cloned.className;
                            img.width = cloned.width;
                            img.height = cloned.height;
                            cloned.parentNode.replaceChild(img, cloned);
                        }
                    });

                    // 2. Hide UI buttons in the screenshot
                    const actions = clonedDoc.querySelector('.actions');
                    if (actions) actions.style.display = 'none';
                    const backBtn = clonedDoc.querySelector('.back-btn');
                    if (backBtn) backBtn.style.display = 'none';
                    const shareBtn = clonedDoc.getElementById('shareStatsBtn');
                    if (shareBtn) shareBtn.style.display = 'none';

                    // Add watermark
                    const watermark = clonedDoc.createElement('div');
                    watermark.style.cssText = `
                        position: absolute; bottom: 10px; right: 10px;
                        color: #ff0055; font-weight: bold; font-family: 'Press Start 2P';
                        font-size: 14px; text-shadow: 2px 2px #000;
                    `;
                    watermark.innerText = "RETRO RAP BATTLE";
                    clonedDoc.body.appendChild(watermark);
                }
            });

            overlay.remove();

            // Show modal with the result
            const previewBlob = await new Promise(r => canvas.toBlob(r, 'image/png'));
            const file = new File([previewBlob], 'moje_karty_rrb.png', { type: 'image/png' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Moja Kolekcja RRB',
                    text: 'Sprawdź mój drop w Retro Rap Battle! 🔥🎤'
                });
            } else {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'RRB_Kolekcja.png';
                link.click();
                alert("Obraz Twojej kolekcji został pobrany! Udostępnij go na Instagramie lub Facebooku.");
            }
        } catch (e) {
            console.error(e);
            overlay.remove();
            alert("Błąd podczas generowania obrazu.");
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CardGenerator;
}
