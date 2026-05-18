import {
  Body,
  Column,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "react-email";

export const EmailOrder = ({ orderDetail = [] }) => {
  const total = orderDetail.reduce((sum, item) => {
    return sum + Number(item?.price || 0);
  }, 0);

  return (
    <Html>
      <Head />
      <Preview>Digi-Store Receipt</Preview>

      <Tailwind>
        <Body className="bg-[#f3f3f3] font-sans">
          <Container className="mx-auto max-w-[760px] bg-white px-6 py-10">
            <Section>
              <Row>
                <Column>
                  <Text className="m-0 text-right text-[54px] font-light text-[#8c8c8c]">
                    Receipt
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="mt-10 bg-[#f5f5f5] px-4 py-2">
              <Text className="m-0 text-[16px] font-semibold text-black">
                Order Details
              </Text>
            </Section>

            <Section className="py-8">
              {orderDetail.length > 0 ? (
                orderDetail.map((order, index) => (
                  <Row key={order?.productId ?? index} className="mb-6">
                    <Column className="w-[80px] align-top">
                      {order?.imageUrl ? (
                        <Img
                          src={order.imageUrl}
                          width="64"
                          height="64"
                          alt={order?.title || "Product image"}
                          className="rounded-[16px] border border-[#e5e5e5]"
                        />
                      ) : (
                        <div className="h-[64px] w-[64px] rounded-[16px] border border-[#e5e5e5]" />
                      )}
                    </Column>

                    <Column className="pl-[22px] align-top">
                      <Text className="m-0 text-[20px] font-semibold text-black">
                        {order?.title || "Product"}
                      </Text>

                      {order?.category && (
                        <Text className="m-0 text-[16px] text-[#666]">
                          {order.category}
                        </Text>
                      )}

                      {order?.description && (
                        <Text className="m-0 text-[16px] text-[#666]">
                          {order.description}
                        </Text>
                      )}

                      {order?.fileUrl && (
                        <Link
                          href={order.fileUrl}
                          className="text-[15px] text-[#0070c9] no-underline"
                        >
                          Download Content
                        </Link>
                      )}
                    </Column>

                    <Column align="right" className="w-[120px] align-top">
                      <Text className="m-0 text-[24px] font-semibold text-black">
                        ${Number(order?.price || 0).toFixed(2)}
                      </Text>
                    </Column>
                  </Row>
                ))
              ) : (
                <Text className="m-0 text-[16px] text-[#666]">
                  No products found in this order.
                </Text>
              )}
            </Section>

            <Hr className="border-[#e5e5e5]" />

            <Section className="py-6">
              <Row>
                <Column align="right">
                  <Text className="m-0 text-[14px] font-bold text-[#666]">
                    TOTAL
                  </Text>
                </Column>

                <Column align="right" className="w-[140px]">
                  <Text className="m-0 text-[34px] font-bold text-black">
                    ${total.toFixed(2)}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Hr className="border-[#e5e5e5]" />

            <Section className="py-20">
              <Text className="text-center text-[28px] font-semibold leading-tight text-black">
                Thanks for your purchase.
              </Text>
              <Text className="mt-3 text-center text-[16px] text-[#666]">
                Your receipt and product access are available above.
              </Text>
            </Section>

            <Section>
              <Text className="text-center text-[14px] text-[#0070c9]">
                <Link href="#" className="text-[#0070c9] no-underline">
                  Account Settings
                </Link>
                {" • "}
                <Link href="#" className="text-[#0070c9] no-underline">
                  Terms of Sale
                </Link>
                {" • "}
                <Link href="#" className="text-[#0070c9] no-underline">
                  Privacy Policy
                </Link>
              </Text>

              <Text className="mt-8 text-center text-[15px] text-[#777]">
                Copyright © 2023 Digi-Store
              </Text>

              <Text className="text-center text-[15px] font-medium text-[#0070c9]">
                All rights reserved
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default EmailOrder;