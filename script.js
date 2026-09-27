const form = document.getElementById("webhookForm");
const webhookUrl = document.getElementById("webhookUrl");
const username = document.getElementById("username");
const avatarUrl = document.getElementById("avatarUrl");
const content = document.getElementById("content");
const embedTitle = document.getElementById("embedTitle");
const embedUrl = document.getElementById("embedUrl");
const embedDescription = document.getElementById("embedDescription");
const embedColor = document.getElementById("embedColor");
const embedTimestamp = document.getElementById("embedTimestamp");
const defaultInline = document.getElementById("defaultInline");
const authorName = document.getElementById("authorName");
const authorIcon = document.getElementById("authorIcon");
const thumbnailUrl = document.getElementById("thumbnailUrl");
const imageUrl = document.getElementById("imageUrl");
const footerText = document.getElementById("footerText");
const footerIcon = document.getElementById("footerIcon");
const fieldsList = document.getElementById("fieldsList");
const addFieldButton = document.getElementById("addFieldButton");
const sendButton = document.getElementById("sendButton");
const clearButton = document.getElementById("clearButton");
const statusText = document.getElementById("status");
const previewAvatar = document.getElementById("previewAvatar");
const previewUsername = document.getElementById("previewUsername");
const previewContent = document.getElementById("previewContent");
const embedPreview = document.getElementById("embedPreview");
const previewAuthor = document.getElementById("previewAuthor");
const previewTitle = document.getElementById("previewTitle");
const previewDescription = document.getElementById("previewDescription");
const previewThumbnail = document.getElementById("previewThumbnail");
const previewFields = document.getElementById("previewFields");
const previewImage = document.getElementById("previewImage");
const previewFooter = document.getElementById("previewFooter");
const payloadPreview = document.getElementById("payloadPreview");

let fieldCount = 0;

function setStatus(message, type = "") {
    statusText.textContent = message;
    statusText.className = `status ${type}`.trim();
}

function isLarpcordWebhook(url) {
    try {
        const parsed = new URL(url);
        return parsed.origin === "https://larpcord.net" && parsed.pathname.startsWith("/api/v10/webhooks/");
    } catch {
        return false;
    }
}

function isUrl(value) {
    if (!value) {
        return false;
    }

    try {
        const parsed = new URL(value);
        return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
        return false;
    }
}

function hexToDecimal(hex) {
    return parseInt(hex.replace("#", ""), 16);
}

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getFields() {
    return [...fieldsList.querySelectorAll(".field-card")]
        .map((card) => {
            const name = card.querySelector(".field-name").value.trim();
            const value = card.querySelector(".field-value").value.trim();
            const inline = card.querySelector(".field-inline").checked;

            if (!name || !value) {
                return null;
            }

            return { name, value, inline };
        })
        .filter(Boolean)
        .slice(0, 25);
}

function buildEmbed() {
    const embed = {};
    const fields = getFields();

    if (embedTitle.value.trim()) {
        embed.title = embedTitle.value.trim();
    }

    if (embedUrl.value.trim()) {
        embed.url = embedUrl.value.trim();
    }

    if (embedDescription.value.trim()) {
        embed.description = embedDescription.value.trim();
    }

    if (embedColor.value) {
        embed.color = hexToDecimal(embedColor.value);
    }

    if (authorName.value.trim()) {
        embed.author = { name: authorName.value.trim() };

        if (authorIcon.value.trim()) {
            embed.author.icon_url = authorIcon.value.trim();
        }
    }

    if (thumbnailUrl.value.trim()) {
        embed.thumbnail = { url: thumbnailUrl.value.trim() };
    }

    if (imageUrl.value.trim()) {
        embed.image = { url: imageUrl.value.trim() };
    }

    if (footerText.value.trim()) {
        embed.footer = { text: footerText.value.trim() };

        if (footerIcon.value.trim()) {
            embed.footer.icon_url = footerIcon.value.trim();
        }
    }

    if (embedTimestamp.checked) {
        embed.timestamp = new Date().toISOString();
    }

    if (fields.length) {
        embed.fields = fields;
    }

    const hasEmbedContent = Object.keys(embed).some((key) => key !== "color") || fields.length;
    return hasEmbedContent ? embed : null;
}

function buildPayload() {
    const payload = {};
    const message = content.value.trim();
    const embed = buildEmbed();

    if (message) {
        payload.content = message;
    }

    if (username.value.trim()) {
        payload.username = username.value.trim();
    }

    if (avatarUrl.value.trim()) {
        payload.avatar_url = avatarUrl.value.trim();
    }

    if (embed) {
        payload.embeds = [embed];
    }

    return payload;
}

function setImage(element, url) {
    element.removeAttribute("src");
    element.classList.remove("visible");

    if (isUrl(url)) {
        element.src = url;
        element.classList.add("visible");
    }
}

function updatePreview() {
    const payload = buildPayload();
    const displayName = username.value.trim() || "Larphook";
    const avatar = avatarUrl.value.trim();
    const embed = payload.embeds?.[0];

    previewUsername.textContent = displayName;
    previewContent.textContent = payload.content || "Your message preview appears here.";

    if (isUrl(avatar)) {
        previewAvatar.innerHTML = `<img src="${escapeHtml(avatar)}" alt="">`;
    } else {
        previewAvatar.textContent = displayName.charAt(0).toUpperCase();
    }

    embedPreview.classList.toggle("empty", !embed);
    previewFields.innerHTML = "";
    previewFields.classList.remove("has-inline");
    previewAuthor.innerHTML = "";
    previewFooter.innerHTML = "";
    previewTitle.textContent = "";
    previewDescription.textContent = "";
    previewThumbnail.removeAttribute("src");
    previewImage.removeAttribute("src");
    previewImage.classList.remove("visible");
    embedPreview.classList.remove("has-thumbnail");

    if (embed) {
        embedPreview.style.borderLeftColor = embedColor.value;

        if (embed.author?.name) {
            previewAuthor.innerHTML = `${embed.author.icon_url && isUrl(embed.author.icon_url) ? `<img src="${escapeHtml(embed.author.icon_url)}" alt="">` : ""}<span>${escapeHtml(embed.author.name)}</span>`;
        }

        if (embed.title) {
            previewTitle.textContent = embed.title;
            previewTitle.href = embed.url && isUrl(embed.url) ? embed.url : "#";
        }

        if (embed.description) {
            previewDescription.textContent = embed.description;
        }

        if (embed.thumbnail?.url && isUrl(embed.thumbnail.url)) {
            previewThumbnail.src = embed.thumbnail.url;
            embedPreview.classList.add("has-thumbnail");
        }

        if (embed.fields?.length) {
            const hasInline = embed.fields.some((field) => field.inline);
            previewFields.classList.toggle("has-inline", hasInline);

            embed.fields.forEach((field) => {
                const item = document.createElement("div");
                item.className = `embed-field${field.inline ? " inline" : ""}`;
                item.innerHTML = `<div class="embed-field-name">${escapeHtml(field.name)}</div><div class="embed-field-value">${escapeHtml(field.value)}</div>`;
                previewFields.appendChild(item);
            });
        }

        setImage(previewImage, embed.image?.url || "");

        if (embed.footer?.text) {
            previewFooter.innerHTML = `${embed.footer.icon_url && isUrl(embed.footer.icon_url) ? `<img src="${escapeHtml(embed.footer.icon_url)}" alt="">` : ""}<span>${escapeHtml(embed.footer.text)}</span>`;
        }
    }

    payloadPreview.textContent = JSON.stringify(payload, null, 2);
}

function addField(name = "", value = "", inline = defaultInline.checked) {
    if (fieldsList.children.length >= 25) {
        setStatus("Discord-style embeds support up to 25 fields.", "error");
        return;
    }

    fieldCount += 1;
    const card = document.createElement("div");
    card.className = "field-card";
    card.innerHTML = `
        <div class="field-card-header">
            <span class="field-card-title">Field ${fieldCount}</span>
            <button type="button" class="remove-field" aria-label="Remove field"><i class="fa-solid fa-trash"></i></button>
        </div>
        <div class="grid">
            <label class="field">
                <span>Name</span>
                <input class="field-name" type="text" maxlength="256" placeholder="Field name" value="${escapeHtml(name)}">
            </label>
            <label class="field toggle-field">
                <span>Inline</span>
                <div class="toggle-row">
                    <input class="field-inline" type="checkbox" ${inline ? "checked" : ""}>
                    <label>Display inline</label>
                </div>
            </label>
        </div>
        <label class="field">
            <span>Value</span>
            <textarea class="field-value" rows="3" maxlength="1024" placeholder="Field value">${escapeHtml(value)}</textarea>
        </label>
    `;

    card.querySelector(".remove-field").addEventListener("click", () => {
        card.remove();
        updatePreview();
    });

    card.querySelectorAll("input, textarea").forEach((input) => {
        input.addEventListener("input", updatePreview);
        input.addEventListener("change", updatePreview);
    });

    fieldsList.appendChild(card);
    updatePreview();
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const url = webhookUrl.value.trim();
    const payload = buildPayload();

    if (!isLarpcordWebhook(url)) {
        setStatus("Use a valid Larpcord webhook URL.", "error");
        return;
    }

    if (!payload.content && !payload.embeds?.length) {
        setStatus("Add message content or at least one embed detail.", "error");
        return;
    }

    sendButton.disabled = true;
    setStatus("Sending webhook...");

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Request failed with status ${response.status}`);
        }

        setStatus("Webhook sent successfully.", "success");
    } catch (error) {
        setStatus(error.message || "Failed to send webhook.", "error");
    } finally {
        sendButton.disabled = false;
    }
});

addFieldButton.addEventListener("click", () => addField());

clearButton.addEventListener("click", () => {
    username.value = "";
    avatarUrl.value = "";
    content.value = "";
    embedTitle.value = "";
    embedUrl.value = "";
    embedDescription.value = "";
    embedColor.value = "#1684ff";
    embedTimestamp.checked = false;
    defaultInline.checked = false;
    authorName.value = "";
    authorIcon.value = "";
    thumbnailUrl.value = "";
    imageUrl.value = "";
    footerText.value = "";
    footerIcon.value = "";
    fieldsList.innerHTML = "";
    setStatus("");
    updatePreview();
});

document.querySelectorAll("input, textarea").forEach((input) => {
    input.addEventListener("input", updatePreview);
    input.addEventListener("change", updatePreview);
});

addField("@fallinginlove2012", "made by @fallinginlove2012", true);
updatePreview();
