import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    PDFViewer,
    Image,
} from "@react-pdf/renderer";

// Styles for PDF document
const styles = StyleSheet.create({
    viewer: {
        width: "100vw",
        height: "100vh",
    },
    page: {
        backgroundColor: "#ffffff",
        padding: 0,
    },
    // Header with dark background
    headerContainer: {
        backgroundColor: "#1a1a1a",
        padding: 40,
        paddingBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#ffffff",
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    authorRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    authorLabel: {
        fontSize: 11,
        color: "#a3a3a3",
        marginRight: 8,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    authorName: {
        fontSize: 12,
        color: "#e5e5e5",
        fontWeight: "bold",
    },
    divider: {
        height: 1,
        backgroundColor: "#404040",
        marginVertical: 16,
    },
    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    metaGroup: {
        flexDirection: "row",
        gap: 24,
    },
    metaItem: {
        flexDirection: "column",
    },
    metaLabel: {
        fontSize: 9,
        color: "#737373",
        marginBottom: 4,
        textTransform: "uppercase",
        letterSpacing: 0.8,
    },
    metaValue: {
        fontSize: 13,
        color: "#f5f5f5",
        fontWeight: "bold",
    },
    badge: {
        backgroundColor: "#ffffff",
        color: "#1a1a1a",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 3,
        fontSize: 10,
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: 0.8,
    },
    // Content area
    content: {
        padding: 40,
        paddingTop: 35,
    },
    section: {
        marginBottom: 28,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    sectionAccent: {
        width: 4,
        height: 20,
        backgroundColor: "#1a1a1a",
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#1a1a1a",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    description: {
        fontSize: 11,
        color: "#525252",
        lineHeight: 1.7,
        marginBottom: 10,
        paddingLeft: 16,
        borderLeft: "2 solid #e5e5e5",
        fontStyle: "italic",
    },
    // Ingredients styling
    ingredientsList: {
        backgroundColor: "#fafafa",
        padding: 20,
        borderRadius: 4,
        border: "1 solid #e5e5e5",
    },
    ingredientsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    ingredientItem: {
        width: "50%",
        fontSize: 11,
        color: "#262626",
        marginBottom: 10,
        paddingRight: 10,
    },
    ingredientBullet: {
        width: 6,
        height: 6,
        backgroundColor: "#1a1a1a",
        borderRadius: 3,
        marginRight: 8,
        marginTop: 4,
    },
    ingredientRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    // Steps styling
    stepsList: {
        marginTop: 4,
    },
    stepItem: {
        flexDirection: "row",
        backgroundColor: "#fafafa",
        padding: 14,
        paddingLeft: 16,
        borderRadius: 4,
        border: "1 solid #e5e5e5",
        marginBottom: 12,
        alignItems: "flex-start",
    },
    stepNumber: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#1a1a1a",
        marginRight: 12,
        minWidth: 20,
    },
    stepText: {
        flex: 1,
        fontSize: 11,
        color: "#404040",
        lineHeight: 1.7,
        paddingTop: 2,
    },
    // Stats banner
    statsBanner: {
        flexDirection: "row",
        backgroundColor: "#fafafa",
        borderTop: "1 solid #e5e5e5",
        borderBottom: "1 solid #e5e5e5",
        paddingVertical: 12,
        paddingHorizontal: 40,
        marginTop: 8,
        marginBottom: 28,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
    },
    statValue: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#1a1a1a",
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 9,
        color: "#737373",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    // Footer
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#1a1a1a",
        paddingVertical: 16,
        paddingHorizontal: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footerText: {
        fontSize: 9,
        color: "#737373",
    },
    footerBrand: {
        fontSize: 11,
        color: "#ffffff",
        fontWeight: "bold",
        letterSpacing: 1,
        textTransform: "uppercase",
    },
    recipeIdBadge: {
        backgroundColor: "#404040",
        color: "#e5e5e5",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 2,
        fontSize: 9,
        fontWeight: "bold",
    },
});

const RecipePdf = () => {
    // const location = useLocation();
    const navigate = useNavigate();

    let recipe = localStorage.getItem("recipe");
    recipe = JSON.parse(recipe);

    // Redirect if no recipe data
    useEffect(() => {
        if (!recipe) {
            console.error("No recipe data found");
            navigate(-1); // Go back to previous page
        }
    }, [recipe, navigate]);

    // Don't render if no recipe
    if (!recipe) {
        return null;
    }

    // Parse ingredients string into array
    const ingredientsArray = recipe.ingredients
        ? recipe.ingredients.split(",").map((item) => item.trim())
        : [];

    // Parse steps array (already an array)
    const stepsArray = Array.isArray(recipe.steps) ? recipe.steps : [];

    // Format current date
    const currentDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <PDFViewer style={styles.viewer}>
            <Document
                title={`${recipe.recipeName} - Recipe`}
                author={recipe.username}
                subject="Recipe PDF"
            >
                <Page size="A4" style={styles.page}>
                    {/* Dark Header Section */}
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>{recipe.recipeName}</Text>

                        <View style={styles.authorRow}>
                            <Text style={styles.authorLabel}>Created by</Text>
                            <Text style={styles.authorName}>{recipe.username}</Text>
                        </View>

                        <View style={styles.divider} />

                        {/* Meta Information Row */}
                        <View style={styles.metaRow}>
                            <View style={styles.metaGroup}>
                                <View style={styles.metaItem}>
                                    <Text style={styles.metaLabel}>Cook Time</Text>
                                    <Text style={styles.metaValue}>{recipe.cookTime} min</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <Text style={styles.metaLabel}>Servings</Text>
                                    <Text style={styles.metaValue}>4 people</Text>
                                </View>
                            </View>

                            {/* Category Badge */}
                            <Text style={styles.badge}>{recipe.category}</Text>
                        </View>
                    </View>

                    {/* Stats Banner */}
                    <View style={styles.statsBanner}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{ingredientsArray.length}</Text>
                            <Text style={styles.statLabel}>Ingredients</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{stepsArray.length}</Text>
                            <Text style={styles.statLabel}>Steps</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{recipe.cookTime}</Text>
                            <Text style={styles.statLabel}>Minutes</Text>
                        </View>
                    </View>

                    {/* Content Area */}
                    <View style={styles.content}>
                        {/* Description Section */}
                        {recipe.description && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <View style={styles.sectionAccent} />
                                    <Text style={styles.sectionTitle}>About This Recipe</Text>
                                </View>
                                <Text style={styles.description}>{recipe.description}</Text>
                            </View>
                        )}

                        {/* Ingredients Section */}
                        {ingredientsArray.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <View style={styles.sectionAccent} />
                                    <Text style={styles.sectionTitle}>Ingredients</Text>
                                </View>
                                <View style={styles.ingredientsList}>
                                    <View style={styles.ingredientsGrid}>
                                        {ingredientsArray.map((ingredient, index) => (
                                            <View key={index} style={styles.ingredientRow}>
                                                <View style={styles.ingredientBullet} />
                                                <Text style={styles.ingredientItem}>{ingredient}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Cooking Steps Section */}
                        {stepsArray.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <View style={styles.sectionAccent} />
                                    <Text style={styles.sectionTitle}>Instructions</Text>
                                </View>
                                <View style={styles.stepsList}>
                                    {stepsArray.map((step, index) => (
                                        <View key={index} style={styles.stepItem} wrap={false}>
                                            <Text style={styles.stepNumber}>{index + 1}.</Text>
                                            <Text style={styles.stepText}>{step}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Dark Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Generated on {currentDate} • Recipe #{recipe.recipeId}
                        </Text>
                        <Text style={styles.footerBrand}>Dishcovery</Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default RecipePdf;