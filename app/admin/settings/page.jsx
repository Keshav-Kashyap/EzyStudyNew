"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
const page = () => {
    return (
        <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <div>
                <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Settings</h2>
                <p className="text-gray-600 dark:text-gray-400">Configure your dashboard preferences</p>
            </div>

            <Card className="transition-colors duration-300 bg-white dark:bg-black/20 border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-none">
                <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-white">General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-gray-900 dark:text-white">Email Notifications</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates about course uploads</p>
                        </div>
                        <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-gray-900 dark:text-white">Auto-backup</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Automatically backup course data</p>
                        </div>
                        <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-gray-900 dark:text-white">Dark Mode</Label>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Use dark theme</p>
                        </div>
                        <Switch
                        // checked={isDarkMode}
                        // onCheckedChange={setIsDarkMode}
                        />
                    </div>
                </CardContent>
            </Card>
        </motion.div>

    )
}

export default page