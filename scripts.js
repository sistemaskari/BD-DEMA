// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCRRDUfJFAEF3c9lly8tOnIinBrkWoONhk",
    authDomain: "dema-expedientes.firebaseapp.com",
    projectId: "dema-expedientes",
    storageBucket: "dema-expedientes.appspot.com",
    messagingSenderId: "606027989070",
    appId: "1:606027989070:web:20965dbcf1d38ba6dc031f",
    measurementId: "G-B7VMX8HCZG"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Función para subir un archivo PDF a Firebase Storage
async function subirPDF() {
    const fileInput = document.getElementById("uploadPDF");
    const pdfFile = fileInput.files[0];

    if (!pdfFile) {
        alert("Selecciona un archivo PDF para subir.");
        return;
    }

    // Referencia en Firebase Storage
    const storageRef = ref(storage, `pdfs/${pdfFile.name}`);

    try {
        // Subir el archivo
        await uploadBytes(storageRef, pdfFile);
        const downloadURL = await getDownloadURL(storageRef);
        
        console.log("Archivo subido con éxito:", downloadURL);
        alert("PDF subido con éxito.");

        // Actualizar la lista de PDFs
        mostrarPDFs();
    } catch (error) {
        console.error("Error al subir el archivo:", error);
        alert("Hubo un error al subir el archivo.");
    }
}

// Función para mostrar los PDFs guardados
async function mostrarPDFs() {
    const storageRef = ref(storage, "pdfs/");
    const pdfListDiv = document.getElementById("pdfList");
    pdfListDiv.innerHTML = ""; // Limpiar la lista

    try {
        const archivos = await listAll(storageRef);
        archivos.items.forEach(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            console.log("Archivo encontrado:", url);

            // Crear un enlace para el PDF
            const link = document.createElement("a");
            link.href = url;
            link.textContent = itemRef.name;
            link.target = "_blank";

            pdfListDiv.appendChild(link);
            pdfListDiv.appendChild(document.createElement("br"));
        });
    } catch (error) {
        console.error("Error al listar archivos:", error);
    }
}

// Cargar los PDFs cuando la página cargue
window.onload = mostrarPDFs;
