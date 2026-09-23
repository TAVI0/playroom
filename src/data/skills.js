// Categorías tomadas de habilidadesTecnicas en
// scripts/data/informacion-verificada.json (fuente de verdad del CV) --
// agrupadas para la ventana de Skills, con menos categorías que claves tiene
// ese JSON (se combinan las más chicas) para que entren cómodas en pantalla.
export const skillCategories = [
	{
		label: "Lenguajes",
		icon: "💻",
		items: ["Java", "TypeScript", "Python", "Solidity"],
	},
	{
		label: "Frameworks y librerías",
		icon: "🧩",
		items: ["Spring Boot", "Spring Security", "React", "Node.js", "Hibernate", "MyBatis"],
	},
	{
		label: "Bases de datos",
		icon: "🗄️",
		items: ["MySQL", "PostgreSQL", "Oracle", "MongoDB"],
	},
	{
		label: "Infraestructura y cloud",
		icon: "☁️",
		items: ["Docker", "AWS", "Jenkins", "Apache Tomcat", "OpenShift", "Maven", "Gradle"],
	},
	{
		label: "Seguridad y mensajería",
		icon: "🔐",
		items: ["JWT", "Keycloak / OIDC", "Kafka"],
	},
	{
		label: "Herramientas y metodologías",
		icon: "🛠️",
		items: ["Git", "Postman", "Jira", "Confluence", "Sonar / JaCoCo", "Scrum", "Kanban"],
	},
];
