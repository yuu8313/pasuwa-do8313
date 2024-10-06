document.addEventListener('DOMContentLoaded', () => {
    const passwordDisplay = document.getElementById('password');
    const generateBtn = document.getElementById('generatePassword');
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('lengthValue');
    const copyBtn = document.getElementById('copyPassword');
    const saveBtn = document.getElementById('savePassword');
    const downloadCSVBtn = document.getElementById('downloadCSV');
    const strengthMeter = document.querySelector('.meter-bar');
    const strengthValue = document.getElementById('strengthValue');
    const savedPasswordsList = document.querySelector('#savedPasswords ul');

    function generatePassword() {
        const length = parseInt(lengthSlider.value);
        const useUppercase = document.getElementById('uppercase').checked;
        const useLowercase = document.getElementById('lowercase').checked;
        const useNumbers = document.getElementById('numbers').checked;
        const useSymbols = document.getElementById('symbols').checked;

        const chars = [
            ...(useUppercase ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : ''),
            ...(useLowercase ? 'abcdefghijklmnopqrstuvwxyz' : ''),
            ...(useNumbers ? '0123456789' : ''),
            ...(useSymbols ? '!@#$%^&*()_+~`|}{[]:;?><,./-=' : '')
        ].join('');

        if (chars.length === 0) {
            alert('少なくとも1つのオプションを選択してください。');
            return;
        }

        passwordDisplay.textContent = '生成中...';
        passwordDisplay.classList.add('generating');

        setTimeout(() => {
            const password = Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
            passwordDisplay.textContent = password;
            passwordDisplay.classList.remove('generating');
            updateStrengthMeter(password);
        }, 1000);
    }

    function updateStrengthMeter(password) {
        const strength = calculatePasswordStrength(password);
        strengthMeter.style.width = `${strength}%`;
        if (strength < 33) {
            strengthMeter.style.backgroundColor = '#ff4d4d';
            strengthValue.textContent = '弱い';
        } else if (strength < 66) {
            strengthMeter.style.backgroundColor = '#ffd700';
            strengthValue.textContent = '中程度';
        } else {
            strengthMeter.style.backgroundColor = '#00cc44';
            strengthValue.textContent = '強い';
        }
    }

    function calculatePasswordStrength(password) {
        let strength = 0;
        if (password.match(/[a-z]+/)) strength += 25;
        if (password.match(/[A-Z]+/)) strength += 25;
        if (password.match(/[0-9]+/)) strength += 25;
        if (password.match(/[$@#&!]+/)) strength += 25;
        return Math.min(100, strength + (password.length - 8) * 5);
    }

    function copyPassword() {
        const password = passwordDisplay.textContent;
        navigator.clipboard.writeText(password).then(() => {
            alert('パスワードをクリップボードにコピーしました！');
        });
    }

    function savePassword() {
        const password = passwordDisplay.textContent;
        if (password && password !== '生成中...') {
            const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');
            savedPasswords.push(password);
            localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
            updateSavedPasswordsList();
        }
    }

    function updateSavedPasswordsList() {
        const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');
        savedPasswordsList.innerHTML = '';
        savedPasswords.forEach((password, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${password}</span>
                <button class="delete-password" data-index="${index}">削除</button>
            `;
            savedPasswordsList.appendChild(li);
        });
    }

    function deleteSavedPassword(index) {
        const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');
        savedPasswords.splice(index, 1);
        localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
        updateSavedPasswordsList();
    }

    function downloadCSV() {
        const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');
        const csvContent = "data:text/csv;charset=utf-8," 
            + savedPasswords.map(password => `"${password}"`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "saved_passwords8313.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    generateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyPassword);
    saveBtn.addEventListener('click', savePassword);
    downloadCSVBtn.addEventListener('click', downloadCSV);

    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
    });

    savedPasswordsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-password')) {
            const index = parseInt(e.target.dataset.index);
            deleteSavedPassword(index);
        }
    });

    // 3D幾何学図形の背景アニメーション
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('background').appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshBasicMaterial({ color: 0x8A2BE2, wireframe: true });
    const shapes = [];

    for (let i = 0; i < 50; i++) {
        const shape = new THREE.Mesh(geometry, material);
        shape.position.set(
            Math.random() * 20 - 10,
            Math.random() * 20 - 10,
            Math.random() * 20 - 10
        );
        shape.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        shapes.push(shape);
        scene.add(shape);
    }

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        shapes.forEach(shape => {
            shape.rotation.x += 0.005;
            shape.rotation.y += 0.005;
            shape.position.y += Math.sin(Date.now() * 0.001 + shape.position.x) * 0.01;
        });
        renderer.render(scene, camera);
    }
    animate();

    updateSavedPasswordsList();
});