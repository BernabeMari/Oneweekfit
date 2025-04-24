// OneWeekFit App JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('userDataForm');
    const generateBtn = document.getElementById('generatePlanBtn');
    const aboutPlanResult = document.getElementById('aboutPlanResult');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const contactForm = document.getElementById('contact-form');
    const contactFormStatus = document.getElementById('contactFormStatus');
    
    // Backend API URL - change to your deployment URL in production
    const API_URL = 'http://localhost:3000/api/generate-plan';
    
    // Show/hide loading indicator
    function toggleLoading(isLoading) {
        if (loadingIndicator) {
            loadingIndicator.style.display = isLoading ? 'block' : 'none';
        }
        if (generateBtn) {
            generateBtn.disabled = isLoading;
        }
    }
    
    // Handle contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (contactFormStatus) {
                contactFormStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending your message...';
                contactFormStatus.style.display = 'block';
                contactFormStatus.className = 'alert alert-info';
            }
            
            const formData = new FormData(contactForm);
            
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData))
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    if (contactFormStatus) {
                        contactFormStatus.innerHTML = '<i class="fas fa-check-circle"></i> ' + data.message;
                        contactFormStatus.className = 'alert alert-success';
                    }
                    contactForm.reset();
                } else {
                    if (contactFormStatus) {
                        contactFormStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + (data.error || 'Failed to send message. Please try again.');
                        contactFormStatus.className = 'alert alert-danger';
                    }
                }
            })
            .catch(error => {
                console.error('Error sending message:', error);
                if (contactFormStatus) {
                    contactFormStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error sending message. Please try again.';
                    contactFormStatus.className = 'alert alert-danger';
                }
            });
        });
    }
    
    // Function to collect user data from form
    function collectUserData() {
        const name = document.getElementById('name').value;
        const age = document.getElementById('age').value;
        const gender = document.getElementById('gender').value;
        const religion = document.getElementById('religion').value;
        const weight = document.getElementById('weight').value;
        const weightUnit = document.getElementById('weight-unit').value;
        const height = document.getElementById('height').value;
        const heightUnit = document.getElementById('height-unit').value;
        
        // Get selected exercises
        const exercises = Array.from(document.querySelectorAll('.selected-exercise'))
            .map(item => ({
                title: item.dataset.title || item.textContent,
                type: item.dataset.type || 'general'
            }));
        
        return {
            userData: {
                name,
                age,
                gender,
                religion,
                weight,
                weightUnit,
                height,
                heightUnit
            },
            exercises: exercises.length > 0 ? exercises : [
                { title: "Walking", type: "cardio" },
                { title: "Push-ups", type: "strength" },
                { title: "Squats", type: "strength" }
            ]
        };
    }
    
    // Function to display the generated plan in the About section
    function displayPlan(plan) {
        if (!aboutPlanResult) return;
        
        // Clear previous content
        aboutPlanResult.innerHTML = '';
        
        // Create container for the plan - keep as pre-formatted text
        const planContent = document.createElement('pre');
        planContent.className = 'plan-content';
        planContent.id = 'planContentText';
        planContent.style.backgroundColor = 'transparent';
        planContent.style.border = 'none';
        planContent.style.fontFamily = 'inherit';
        planContent.style.fontSize = '16px';
        planContent.style.color = 'white';
        planContent.style.whiteSpace = 'pre-wrap';
        planContent.textContent = plan; // Use textContent to keep formatting intact
        
        // Add print and download buttons
        const actionButtons = document.createElement('div');
        actionButtons.className = 'action-buttons';
        actionButtons.style.marginTop = '20px';
        
        const printBtn = document.createElement('button');
        printBtn.className = 'tm-btn';
        printBtn.textContent = 'Print Plan';
        printBtn.style.marginRight = '10px';
        printBtn.onclick = () => window.print();
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'tm-btn';
        downloadBtn.textContent = 'Download as PDF';
        downloadBtn.onclick = generatePDF;
        
        actionButtons.appendChild(printBtn);
        actionButtons.appendChild(downloadBtn);
        
        // Add content to the result container
        aboutPlanResult.appendChild(planContent);
        aboutPlanResult.appendChild(actionButtons);
        
        // Process links in the content to make them clickable
        processLinks();
        
        // Scroll to About section
        document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Function to process links in the plan content
    function processLinks() {
        const planContent = document.getElementById('planContentText');
        if (!planContent) return;
        
        // Simple regex to find URLs in the text
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        
        // Replace plain text URLs with clickable links
        planContent.innerHTML = planContent.innerHTML.replace(urlRegex, function(url) {
            return `<a href="${url}" target="_blank" style="color: #5fc1e7; text-decoration: underline;">${url}</a>`;
        });
    }
    
    // Function to generate and download PDF
    function generatePDF() {
        // Get the user's name for the PDF filename
        const userName = document.getElementById('name').value || 'User';
        const filename = `OneWeekFit_Plan_${userName.replace(/\s+/g, '_')}.pdf`;
        
        // Create a temporary div for PDF generation with black text
        const tempDiv = document.createElement('div');
        tempDiv.className = 'pdf-content';
        tempDiv.style.width = '100%';
        tempDiv.style.padding = '20px';
        tempDiv.style.color = 'black';
        tempDiv.style.backgroundColor = 'white';
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        
        // Get the plan content and prepare for PDF
        const planContent = document.getElementById('planContentText');
        if (!planContent) {
            alert('No plan content found to download!');
            return;
        }
        
        // Create styled content for PDF
        tempDiv.innerHTML = `
            <h1 style="text-align:center; color:#0d5ca1; margin-bottom:20px;">OneWeekFit Plan</h1>
            <div style="white-space:pre-wrap; font-family:monospace; font-size:12px; line-height:1.5;">
                ${planContent.textContent}
            </div>
            <div style="text-align:center; margin-top:20px; font-size:10px; color:#666;">
                Generated by OneWeekFit | Copyright 2024
            </div>
        `;
        
        document.body.appendChild(tempDiv);
        
        // Initialize jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Use html2canvas to capture the content
        html2canvas(tempDiv, {
            scale: 2, // Higher scale for better quality
            logging: false,
            useCORS: true
        }).then(canvas => {
            // Convert canvas to image
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            
            // Calculate dimensions
            const imgWidth = 210; // A4 width in mm (210mm)
            const pageHeight = 295; // A4 height in mm (297mm)
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            
            // Add first page
            doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            // Add subsequent pages if content is too large
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            // Save the PDF
            doc.save(filename);
            
            // Clean up
            document.body.removeChild(tempDiv);
        });
    }
    
    // Handle exercise selection in the gallery
    document.querySelectorAll('.tm-gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            // Toggle selection
            this.classList.toggle('selected');
            
            // Find or create the button
            let addBtn = this.querySelector('.add-to-target-btn');
            if (!addBtn) {
                return;
            }
            
            if (this.classList.contains('selected')) {
                // Item was selected
                addBtn.textContent = 'Remove';
                addBtn.style.display = 'block';
                
                // Add to selected exercises
                const exerciseTitle = this.querySelector('h2').textContent;
                const exerciseType = this.dataset.type || 'general';
                
                // Create a visual indicator that this exercise is selected
                if (!document.querySelector(`.selected-exercise[data-title="${exerciseTitle}"]`)) {
                    const selectedExercise = document.createElement('div');
                    selectedExercise.className = 'selected-exercise';
                    selectedExercise.dataset.title = exerciseTitle;
                    selectedExercise.dataset.type = exerciseType;
                    selectedExercise.textContent = exerciseTitle;
                    
                    // Apply template styling
                    selectedExercise.style.backgroundColor = 'rgba(0, 75, 136, 0.7)';
                    selectedExercise.style.color = 'white';
                    
                    // Append to selected exercises container if it exists
                    const selectedContainer = document.getElementById('selectedExercises');
                    if (selectedContainer) {
                        selectedContainer.appendChild(selectedExercise);
                    }
                }
            } else {
                // Item was deselected
                addBtn.textContent = 'Add';
                addBtn.style.display = 'none';
                
                // Remove from selected exercises
                const exerciseTitle = this.querySelector('h2').textContent;
                const selectedExercise = document.querySelector(`.selected-exercise[data-title="${exerciseTitle}"]`);
                if (selectedExercise) {
                    selectedExercise.remove();
                }
            }
        });
    });
    
    // Handle form submission
    if (generateBtn) {
        generateBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // Validate form
            if (!validateForm()) {
                alert('Please fill in all required fields');
                return;
            }
            
            // Show loading indicator
            toggleLoading(true);
            
            try {
                // Collect user data
                const data = collectUserData();
                
                // Send request to backend
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                // Check for errors
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to generate plan');
                }
                
                // Process response
                const result = await response.json();
                
                // Display the plan in the About section
                displayPlan(result.plan);
                
            } catch (error) {
                console.error('Error generating plan:', error);
                
                // Display error message in the About section
                if (aboutPlanResult) {
                    aboutPlanResult.innerHTML = `
                        <div class="error-message" style="color: #d9534f; padding: 20px; border: 1px solid #d9534f; border-radius: 5px; margin-bottom: 20px;">
                            <h3>Error</h3>
                            <p>${error.message || 'Failed to generate plan'}</p>
                            <p>Please try again or check your network connection.</p>
                        </div>
                    `;
                    document.querySelector('#about').scrollIntoView({ behavior: 'smooth' });
                } else {
                    alert(`Error: ${error.message || 'Failed to generate plan'}`);
                }
            } finally {
                // Hide loading indicator
                toggleLoading(false);
            }
        });
    }
    
    // Basic form validation
    function validateForm() {
        const requiredFields = ['name', 'age', 'gender', 'weight', 'height'];
        
        for (const field of requiredFields) {
            const element = document.getElementById(field);
            if (!element || !element.value.trim()) {
                return false;
            }
        }
        
        return true;
    }
}); 