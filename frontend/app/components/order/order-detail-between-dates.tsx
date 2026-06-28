import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
    },

    title: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 15,
    },

    orderHeader: {
        marginTop: 12,
        padding: 6,
        borderBottom: 1,
    },

    itemHeader: {
        flexDirection: "row",
        marginTop: 5,
        borderBottom: 1,
        paddingBottom: 3,
        backgroundColor: "black",
        color: "white",
        paddingVertical: "3px"
    },

    itemRow: {
        flexDirection: "row",
        paddingVertical: 2,
    },

    colProduct: {
        width: "40%",
    },

    colQty: {
        width: "15%",
    },

    colPrice: {
        width: "20%",
    },

    colAmount: {
        width: "25%",
        textAlign: "right",
    },

    orderTotal: {
        textAlign: "right",
        marginTop: 4,
        fontWeight: "bold",
    },

    grandTotal: {
        marginTop: 20,
        fontSize: 12,
        textAlign: "right",
        fontWeight: "bold",
    }
    ,
    pageNumber: {
        position: 'absolute',
        fontSize: 9,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: '#999',
    },
    dates:{
        textAlign:'center',
        fontSize:"9px",
        fontWeight:"10px"

    }
});

export function CustomerOrderDetailReport({
    orders,
    fromDate,
    toDate,
}: {
    orders: any[];
    fromDate: string;
    toDate: string;
}) {


    const groupedOrders = Object.values(
        orders.reduce((acc, row) => {
            if (!acc[row.order_no]) {
                acc[row.order_no] = {
                    order_no: row.order_no,
                    order_date: row.created_at,
                    customer_name: row.user_name,
                    items: [],
                };
            }

            acc[row.order_no].items.push({
                product_name: row.product_name,
                quantity: row.quantity,
                price: row.purchase_price,
                price_per_product: row.price_per_product,
            });

            return acc;
        }, {} as Record<number, any>)
    );

    const grandTotal =
        groupedOrders.reduce(
            (sum: number, order: any) =>
                sum +
                order.items.reduce(
                    (
                        itemSum: number,
                        item: any
                    ) =>
                        itemSum +
                        Number(
                            item.price_per_product
                        ),
                    0
                ),
            0
        );

    function formatDate(date: any) {
        return (
            String(date.getDate()).padStart(2, "0") +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0") +
            "-" +
            String(date.getFullYear()).slice(-2)
        );
    }

    const generatedAt = formatDate(new Date())

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>
                    Order Details Report
                </Text>

                <Text style={styles.dates}>
                    Period: {fromDate} - {toDate}
                </Text>

                <Text style={{textAlign:"right"}}>
                    Generated:{generatedAt}
                </Text>

                {groupedOrders.map((order: any, idx: any) => {

                    const orderTotal =
                        order.items.reduce(
                            (
                                sum: number,
                                item: any
                            ) =>
                                sum +
                                Number(
                                    item.price_per_product
                                ),
                            0
                        );

                    return (
                        <View key={idx}>
                            <View style={styles.orderHeader}>
                                <Text>
                                    Order No: {order.order_no}
                                </Text>

                                <Text>
                                    Date: {formatDate(new Date(order.order_date))}
                                </Text>
                                <Text>
                                    Customer:
                                    {order.customer_name}
                                </Text>
                            </View>

                            <View style={styles.itemHeader}>
                                <Text style={styles.colProduct}>
                                    Product
                                </Text>

                                <Text style={styles.colQty}>
                                    Qty
                                </Text>

                                <Text style={styles.colPrice}>
                                    Price
                                </Text>

                                <Text style={styles.colAmount}>
                                    Amount
                                </Text>
                            </View>

                            {order.items.map((item: any, index: any) => (
                                <View
                                    key={index}
                                    style={styles.itemRow}
                                >
                                    <Text
                                        style={styles.colProduct}
                                    >
                                        {item.product_name}
                                    </Text>

                                    <Text style={styles.colQty}>
                                        {item.quantity}
                                    </Text>

                                    <Text style={styles.colPrice}>
                                        €{item.price.toFixed(2)}
                                    </Text>

                                    <Text
                                        style={styles.colAmount}
                                    >
                                        €
                                        {(
                                            item.quantity *
                                            item.price
                                        ).toFixed(2)}
                                    </Text>
                                </View>
                            ))}

                            <Text style={styles.orderTotal}>
                                Order Total:
                                €
                                {orderTotal.toFixed(2)}
                            </Text>
                        </View>
                    );
                }
                )}

                <Text style={styles.grandTotal}>
                    Grand Total:
                    {" "}
                    €{grandTotal.toFixed(2)}
                </Text>
                <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>

    );
}