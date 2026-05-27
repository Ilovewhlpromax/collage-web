const COLLECTIONS_KEY = 'my_collections';

function getCollections() {
    const data = localStorage.getItem(COLLECTIONS_KEY);
    return data ? JSON.parse(data) : [];
}

function saveCollections(collections) {
    localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(collections));
}

function addCollection(collection) {
    const collections = getCollections();
    collections.unshift(collection);
    saveCollections(collections);
}

function deleteCollection(id) {
    const collections = getCollections();
    const filtered = collections.filter(item => item.id !== id);
    saveCollections(filtered);
}

function getCategoryName(category) {
    const categories = {
        art: '艺术品',
        book: '书籍',
        travel: '旅行',
        music: '音乐',
        other: '其他'
    };
    return categories[category] || '其他';
}

function renderCollections(collections, category = 'all') {
    const grid = document.getElementById('collectionGrid');
    const emptyState = document.getElementById('emptyState');
    
    const filtered = category === 'all' 
        ? collections 
        : collections.filter(item => item.category === category);
    
    if (filtered.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    
    grid.innerHTML = filtered.map(item => `
        <div class="collection-card">
            <div class="card-image">
                ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '📷'}
            </div>
            <div class="card-content">
                <span class="card-category">${getCategoryName(item.category)}</span>
                <h3 class="card-title">${item.name}</h3>
                <p class="card-description">${item.description || '暂无描述'}</p>
                <div class="card-actions">
                    <button class="btn-delete" onclick="handleDelete('${item.id}')">删除</button>
                </div>
            </div>
        </div>
    `).join('');
}

function handleDelete(id) {
    if (confirm('确定要删除这个收藏吗？')) {
        deleteCollection(id);
        renderCollections(getCollections(), getActiveCategory());
    }
}

function getActiveCategory() {
    const activeBtn = document.querySelector('.filter-btn.active');
    return activeBtn ? activeBtn.dataset.category : 'all';
}

document.addEventListener('DOMContentLoaded', () => {
    const collections = getCollections();
    renderCollections(collections);
    
    document.getElementById('addForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newCollection = {
            id: Date.now().toString(),
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            image: document.getElementById('image').value,
            category: document.getElementById('category').value,
            createdAt: new Date().toISOString()
        };
        
        addCollection(newCollection);
        renderCollections(getCollections(), getActiveCategory());
        
        e.target.reset();
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCollections(getCollections(), btn.dataset.category);
        });
    });
});